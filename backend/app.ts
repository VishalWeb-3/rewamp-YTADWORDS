import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "./lib/prisma.js";
import { clientIp, limiter } from "./lib/rateLimit.js";
import { adminRouter } from "./lib/admin.js";
import { priceItem, PricingError, type CatalogItem, type PricedItem } from "./lib/catalog.js";

type SessionUser = { id: number; email: string; username: string; name: string | null };

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser | null;
      rawBody?: Buffer;
    }
  }
}

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const CARD_MINIMUM = 35;
const CARD_MAXIMUM = 999;
const isTest = process.env.NODE_ENV === "test";

const firstFrontendUrl = () =>
  process.env.FRONTEND_URL?.split(",")[0]?.trim().replace(/\/$/, "") || "http://localhost:5173";
const apiUrl = () => process.env.API_URL?.replace(/\/$/, "") || "https://youtubeadwords.com";
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const round2 = (n: number) => Math.round(n * 100) / 100;

// Passwords are stretched in the browser (PBKDF2), which sends only the derived key. The server keeps an
// HMAC of that key under a secret pepper, so it never does slow hashing itself (Workers Free allows 10 ms CPU).
const pepper = () => {
  const value = process.env.PASSWORD_PEPPER;
  if (!value) throw new Error("PASSWORD_PEPPER is not set.");
  return value;
};
const hmacHex = (data: string) => crypto.createHmac("sha256", pepper()).update(data).digest("hex");
const hashPasswordKey = (key: string) => hmacHex(`key:${key}`);
/** Stable stand-in for accounts that don't exist, so the salt endpoint doesn't reveal who has one. */
const fakeSalt = (identifier: string) => hmacHex(`salt:${identifier}`).slice(0, 32);

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

// ========== Cryptomus helpers ==========
const md5Sign = (json: string, apiKey: string) =>
  crypto.createHash("md5").update(Buffer.from(json, "utf8").toString("base64") + apiKey).digest("hex");

/** PHP json_encode output: escapes "/" and non-ASCII. Cryptomus signs webhooks this way. */
function phpJsonEncode(value: unknown): string {
  return JSON.stringify(value)
    .replace(/\//g, "\\/")
    .replace(/[\u007f-￿]/g, (c) => "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
}

function isCryptomusConfigured() {
  return !!process.env.CRYPTOMUS_MERCHANT_ID?.trim() && !!process.env.CRYPTOMUS_API_KEY?.trim();
}

function isUplefConfigured() {
  return !!process.env.UPLEF_API_KEY?.trim() && !!process.env.UPLEF_API_SECRET?.trim();
}

async function createCryptomusInvoice(params: {
  amount: number;
  orderId: string;
  successUrl: string;
  callbackUrl: string;
  returnUrl: string;
}): Promise<{ url: string } | { error: string }> {
  const merchant = process.env.CRYPTOMUS_MERCHANT_ID?.trim();
  const apiKey = process.env.CRYPTOMUS_API_KEY?.trim();
  if (!merchant || !apiKey) {
    return { error: "Cryptomus is not configured. Set CRYPTOMUS_MERCHANT_ID and CRYPTOMUS_API_KEY." };
  }

  const body = JSON.stringify({
    amount: params.amount.toFixed(2),
    currency: "USD",
    order_id: params.orderId,
    url_success: params.successUrl,
    url_callback: params.callbackUrl,
    url_return: params.returnUrl,
  });

  const res = await fetch("https://api.cryptomus.com/v1/payment", {
    method: "POST",
    headers: { merchant, sign: md5Sign(body, apiKey), "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(15000),
  });

  const data = (await res.json().catch(() => ({}))) as any;
  if (!res.ok || data.state !== 0) {
    console.error("Cryptomus API Error:", { status: res.status, data });
    return { error: data.message || "Failed to create crypto invoice" };
  }
  const url = data.result?.url;
  if (!url) return { error: "No payment URL in Cryptomus response" };
  return { url };
}

async function createUplefOrder(params: {
  amount: number;
  currency: string;
  externalOrderId: string;
  email: string;
  name: string;
  successUrl: string;
  failureUrl: string;
}): Promise<{ url: string; orderId: string } | { error: string; status: number }> {
  const apiKey = process.env.UPLEF_API_KEY?.trim();
  const apiSecret = process.env.UPLEF_API_SECRET?.trim();
  if (!apiKey || !apiSecret) return { error: "Card payment is not configured", status: 503 };

  const res = await fetch("https://api.uplef.com/api/v1/orders", {
    method: "POST",
    headers: { "X-API-Key": apiKey, "X-API-Secret": apiSecret, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      externalOrderId: params.externalOrderId,
      customer: { email: params.email, name: params.name },
      successUrl: params.successUrl,
      failureUrl: params.failureUrl,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const data = (await res.json().catch(() => null)) as any;
  if (!data) return { error: "Payment provider returned an invalid response", status: 502 };

  const url = data.data?.paymentPageUrl ?? data.paymentPageUrl;
  const orderId = data.data?.order?.orderId ?? data.data?.orderId ?? data.orderId;
  if (!res.ok || data.success === false || !url) {
    console.error("Uplef API Error:", { status: res.status, data });
    return { error: data.message || data.error || "Failed to create payment", status: 502 };
  }
  return { url, orderId: orderId ?? params.externalOrderId };
}

async function getGeoLocation(ip: string) {
  // Skip local and private addresses
  if (!ip || ip === "::1" || ip.startsWith("127.") || ip.startsWith("::ffff:127.") || /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip.replace(/^::ffff:/, ""))) {
    return null;
  }
  try {
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, { signal: AbortSignal.timeout(1500) });
    const data = (await response.json()) as any;
    if (data.success) {
      return { city: data.city, country: data.country, region: data.region, lat: data.latitude, lon: data.longitude };
    }
  } catch (err) {
    console.error("GeoLocation Error:", err);
  }
  return null;
}

// ========== Validation schemas ==========
const emailSchema = z.string().trim().max(254).email("Invalid email address format");
const idParam = z.coerce.number().int().positive();

const signupSchema = z.object({
  email: emailSchema,
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, _ and -"),
  salt: z.string().regex(/^[0-9a-f]{32}$/, "Invalid salt"),
  passwordKey: z.string().regex(/^[0-9a-f]{64}$/, "Invalid password key"),
  name: z.string().trim().max(100).nullish(),
});

const loginSchema = z.object({
  loginIdentifier: z.string().trim().min(1, "Email or username is required").max(254),
  passwordKey: z.string().regex(/^[0-9a-f]{64}$/, "Invalid password key"),
});

const saltSchema = z.object({ loginIdentifier: z.string().trim().min(1).max(254) });

// Orders name a package; the server looks up its price (the browser never sends one)
const packageItemFields = {
  kind: z.literal("package").optional(),
  slug: z.string().max(100),
  tier: z.enum(["regular", "fast", "ads"]).optional(),
  quantity: z.union([z.string().max(20), z.number()]),
};
const itemSchema = (link: z.ZodType<string | undefined>) =>
  z.object({ ...packageItemFields, link });

const catalogItemSchema = itemSchema(z.string().trim().min(1, "A link is required for every item").max(500));
const quoteSchema = z.object({ items: z.array(itemSchema(z.string().max(500).optional())).min(1).max(20) });

const orderSchema = z.object({
  email: emailSchema,
  items: z.array(catalogItemSchema).min(1).max(20),
  paymentMethod: z.enum(["card", "crypto"]),
});

const ticketSchema = z.object({
  email: emailSchema,
  reason: z.string().trim().max(100).optional().transform((v) => v || "General"),
  orderNumber: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().min(1).max(5000),
});

const reviewSchema = z.object({
  page: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
  email: emailSchema,
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(1).max(3000),
});

const paymentLinkSchema = z.object({
  amount: z.coerce.number().positive().max(100000),
  currency: z.string().trim().length(3).optional().default("USD"),
  description: z.string().trim().min(1).max(500),
  customerName: z.string().trim().max(100).optional(),
  customerEmail: emailSchema.optional(),
  customerPhone: z.string().trim().max(40).optional(),
  expiry: z.coerce.date().optional(),
  type: z.enum(["ONE_TIME", "REUSABLE"]).optional().default("ONE_TIME"),
  maxPayments: z.coerce.number().int().positive().optional(),
  redirectUrl: z.string().url().regex(/^https?:\/\//).optional(),
  notes: z.string().trim().max(2000).optional(),
});

const payLinkSchema = z.object({
  paymentMethod: z.enum(["card", "crypto"]),
  email: emailSchema,
});

function badRequest(res: express.Response, error: z.ZodError) {
  const issue = error.issues[0];
  return res.status(400).json({
    error: issue?.message || "Invalid request",
    details: issue ? `${issue.path.join(".") || "body"}: ${issue.message}` : undefined,
  });
}

// Fields safe to send back to the browser (no IP/geolocation data)
const publicOrderSelect = {
  id: true,
  amount: true,
  price: true,
  service: true,
  platform: true,
  status: true,
  username: true,
  paymentMethod: true,
  externalOrderId: true,
  details: true,
  createdAt: true,
} as const;

// ========== App ==========
export const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://youtubeadwords.com",
  "https://yotubeadwords.web.app",
  "https://yotubeadwords.firebaseapp.com",
];
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",").forEach((url) => allowedOrigins.push(url.trim().replace(/\/$/, "")));
}

app.use(cors({ origin: allowedOrigins, credentials: true }));
// Keep the raw body so webhook signatures are checked against the exact bytes received
app.use(express.json({ limit: "100kb", verify: (req, _res, buf) => ((req as express.Request).rawBody = buf) }));
app.use(cookieParser());

if (!isTest) {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

const authLimiter = limiter(20);
const orderLimiter = limiter(30);
const formLimiter = limiter(10);

// Session middleware: read auth cookie, attach req.user
app.use(async (req, _res, next) => {
  req.user = null;
  const token = req.cookies?.auth_token;
  if (!token || typeof token !== "string") return next();
  try {
    const session = await prisma.session.findFirst({
      where: { id: token, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (session) {
      req.user = { id: session.user.id, email: session.user.email, username: session.user.username, name: session.user.name };
    }
  } catch (err) {
    console.error("Session middleware DB error:", err);
  }
  next();
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.user) return res.status(401).json({ error: "Login required" });
  next();
}

/** Responds 403 and returns true if the user is banned. */
async function rejectIfBanned(userId: number, res: express.Response): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { isBanned: true, banReason: true } });
  if (user?.isBanned) {
    res.status(403).json({ error: "Account banned", reason: user.banReason || "Your account has been suspended." });
    return true;
  }
  return false;
}

// The frontend and API share one origin, so the cookie doesn't need SameSite=None
function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
}

async function startSession(res: express.Response, userId: number) {
  // Nothing else deletes expired sessions, so clear this user's old ones at each login
  await prisma.session.deleteMany({ where: { userId, expiresAt: { lt: new Date() } } });
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({
    data: { id: token, userId, expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS) },
  });
  res.cookie("auth_token", token, { ...cookieOptions(), maxAge: SESSION_MAX_AGE_MS });
}

const publicUser = (u: { id: number; email: string; username: string; name: string | null }) => ({
  id: u.id,
  email: u.email,
  username: u.username,
  name: u.name,
});

// ========== Auth ==========
app.post("/api/auth/signup", authLimiter, async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const email = normalizeEmail(parsed.data.email);
  const { username, salt, passwordKey } = parsed.data;
  const name = parsed.data.name || null;

  const existingEmail = await prisma.user.findFirst({ where: { email } });
  if (existingEmail && !existingEmail.isGuest) return res.status(400).json({ error: "Email already exists" });

  const existingUsername = await prisma.user.findFirst({
    where: { usernameLower: username.toLowerCase(), NOT: existingEmail ? { id: existingEmail.id } : undefined },
  });
  if (existingUsername) return res.status(400).json({ error: "Username already exists" });

  const passwordHash = hashPasswordKey(passwordKey);
  // A guest account (from guest checkout) is claimed so the buyer keeps their orders
  const user = existingEmail
    ? await prisma.user.update({
        where: { id: existingEmail.id },
        data: { email, username, usernameLower: username.toLowerCase(), password: passwordHash, passwordSalt: salt, name, isGuest: false },
      })
    : await prisma.user.create({ data: { email, username, usernameLower: username.toLowerCase(), password: passwordHash, passwordSalt: salt, name } });

  if (user.isBanned) {
    return res.status(403).json({ error: "Account banned", reason: user.banReason || "Your account has been suspended." });
  }

  await startSession(res, user.id);
  res.status(201).json({ message: "User created successfully", user: publicUser(user) });
});

// The browser needs the account's salt before it can derive the key to log in with
app.post("/api/auth/salt", authLimiter, async (req, res) => {
  const parsed = saltSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const identifier = parsed.data.loginIdentifier.includes("@")
    ? normalizeEmail(parsed.data.loginIdentifier)
    : parsed.data.loginIdentifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: identifier.includes("@") ? { email: identifier } : { usernameLower: identifier },
    select: { passwordSalt: true, isGuest: true },
  });
  res.json({ salt: user && !user.isGuest && user.passwordSalt ? user.passwordSalt : fakeSalt(identifier) });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const { loginIdentifier, passwordKey } = parsed.data;

  const user = await prisma.user.findFirst({
    where: loginIdentifier.includes("@")
      ? { email: normalizeEmail(loginIdentifier) }
      : { usernameLower: loginIdentifier.toLowerCase() },
  });

  if (!user || user.isGuest || !safeEqual(hashPasswordKey(passwordKey), user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  if (user.isBanned) {
    return res.status(403).json({ error: "Account banned", reason: user.banReason || "Your account has been suspended." });
  }

  await startSession(res, user.id);
  res.json({ message: "Login successful", user: publicUser(user) });
});

// Current user from session cookie. If banned, return 403 so frontend shows overlay.
app.get("/api/auth/me", async (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  if (await rejectIfBanned(req.user.id, res)) {
    res.clearCookie("auth_token", cookieOptions());
    return;
  }
  res.json({ user: req.user });
});

app.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (typeof token === "string") {
    await prisma.session.deleteMany({ where: { id: token } }).catch(() => undefined);
  }
  res.clearCookie("auth_token", cookieOptions());
  res.json({ message: "Logged out" });
});

// ========== Cart (always the logged-in user's own cart) ==========
const cartItemSchema = z.object({
  amount: z.coerce.number().int().positive(),
  price: z.coerce.number().nonnegative(),
  service: z.string().trim().min(1).max(200),
  platform: z.string().trim().min(1).max(50),
  username: z.string().trim().max(500).optional(),
});

app.get("/api/cart", requireAuth, async (req, res) => {
  if (await rejectIfBanned(req.user!.id, res)) return;
  const cartItems = await prisma.cartItem.findMany({ where: { userId: req.user!.id }, orderBy: { createdAt: "desc" } });
  res.json(cartItems);
});

app.post("/api/cart/add", requireAuth, async (req, res) => {
  if (await rejectIfBanned(req.user!.id, res)) return;
  const parsed = cartItemSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const cartItem = await prisma.cartItem.create({ data: { ...parsed.data, userId: req.user!.id } });
  res.status(201).json(cartItem);
});

app.delete("/api/cart/remove/:itemId", requireAuth, async (req, res) => {
  const itemId = idParam.safeParse(req.params.itemId);
  if (!itemId.success) return res.status(400).json({ error: "Invalid item ID" });
  const { count } = await prisma.cartItem.deleteMany({ where: { id: itemId.data, userId: req.user!.id } });
  if (!count) return res.status(404).json({ error: "Cart item not found" });
  res.json({ message: "Item removed from cart" });
});

app.delete("/api/cart/clear", requireAuth, async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user!.id } });
  res.json({ message: "Cart cleared successfully" });
});

// ========== Orders ==========
app.get("/api/orders", requireAuth, async (req, res) => {
  if (await rejectIfBanned(req.user!.id, res)) return;
  const orders = await prisma.order.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: "desc" },
    select: publicOrderSelect,
  });
  res.json(orders);
});

app.get("/api/orders/detail/:orderId", requireAuth, async (req, res) => {
  const orderId = idParam.safeParse(req.params.orderId);
  if (!orderId.success) return res.status(400).json({ error: "Invalid order ID" });
  const order = await prisma.order.findFirst({
    where: { id: orderId.data, userId: req.user!.id },
    select: publicOrderSelect,
  });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Payment status for the success page. The external order ID is a random UUID, so it works as a capability.
app.get("/api/orders/status/:externalOrderId", async (req, res) => {
  const externalOrderId = String(req.params.externalOrderId);
  if (!/^(ORDER|LINK)_[\w-]{8,80}$/.test(externalOrderId)) return res.status(400).json({ error: "Invalid order reference" });
  const orders = await prisma.order.findMany({ where: { externalOrderId }, select: { status: true, price: true } });
  if (!orders.length) return res.status(404).json({ error: "Order not found" });
  const status = orders.every((o) => o.status === "PROGRESS" || o.status === "COMPLETED")
    ? "PAID"
    : orders.some((o) => o.status === "CANCELED")
      ? "CANCELED"
      : "PENDING";
  res.json({ status, totalAmount: round2(orders.reduce((sum, o) => sum + o.price, 0)), items: orders.length });
});

type QuotedItem = PricedItem & { link?: string; details?: Record<string, unknown> };

function quoteItems(items: Array<z.infer<typeof catalogItemSchema> | (CatalogItem & { link?: string })>) {
  const priced: QuotedItem[] = items.map((item) => {
    const base = priceItem(item as CatalogItem);
    return { ...base, link: (item as any).link };
  });
  return { priced, total: round2(priced.reduce((sum, item) => sum + item.price, 0)) };
}

// Price a set of packages without placing an order (used by checkout and shared payment links)
app.post("/api/orders/quote", async (req, res) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  try {
    const { priced, total } = quoteItems(parsed.data.items);
    res.json({
      items: priced.map(({ platform, service, amount, price }) => ({ platform, service, amount, price })),
      totalAmount: total,
      cardAvailable: total >= CARD_MINIMUM && total <= CARD_MAXIMUM,
    });
  } catch (err) {
    if (err instanceof PricingError) return res.status(400).json({ error: err.message });
    throw err;
  }
});

/** Finds the account an order belongs to: the logged-in user, or a guest account for the email. */
async function resolveBuyer(req: express.Request, res: express.Response, email: string) {
  if (req.user) {
    if (await rejectIfBanned(req.user.id, res)) return null;
    return req.user;
  }
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing && !existing.isGuest) {
    res.status(409).json({
      error: "An account already uses this email",
      details: "Please log in to place an order with this email address.",
    });
    return null;
  }
  if (existing?.isBanned) {
    res.status(403).json({ error: "Account banned", reason: existing.banReason || "Your account has been suspended." });
    return null;
  }
  if (existing) return existing;

  const guestUsername = `guest_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  return prisma.user.create({
    data: {
      email,
      username: guestUsername,
      usernameLower: guestUsername,
      // Guests never log in (login rejects them), so they get an unusable placeholder instead of a real hash.
      password: `!${crypto.randomBytes(32).toString("hex")}`,
      name: null,
      isGuest: true,
    },
  });
}

app.post("/api/orders/create", orderLimiter, async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const { paymentMethod } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  let quote: ReturnType<typeof quoteItems>;
  try {
    quote = quoteItems(parsed.data.items);
  } catch (err) {
    if (err instanceof PricingError) return res.status(400).json({ error: "Invalid package", details: err.message });
    throw err;
  }
  const { priced, total } = quote;

  if (paymentMethod === "card" && (total < CARD_MINIMUM || total > CARD_MAXIMUM)) {
    return res.status(400).json({
      error: "Invalid payment method",
      details:
        total < CARD_MINIMUM
          ? `Card payments are only available for orders $${CARD_MINIMUM} and above.`
          : `Card payments are only available for orders up to $${CARD_MAXIMUM}. Please use Crypto for this high-value order.`,
    });
  }
  if (paymentMethod === "card" ? !isUplefConfigured() : !isCryptomusConfigured()) {
    return res.status(503).json({
      error: "Payment method unavailable",
      details: `${paymentMethod === "card" ? "Card" : "Crypto"} payments are temporarily unavailable. Please try another method or contact support.`,
    });
  }

  const user = await resolveBuyer(req, res, email);
  if (!user) return;

  const externalOrderId = `ORDER_${crypto.randomUUID()}`;
  const successUrl = `${firstFrontendUrl()}/payment/success?order=${externalOrderId}`;
  const failureUrl = `${firstFrontendUrl()}/payment/failure?order=${externalOrderId}`;

  let paymentUrl: string;
  let uplefOrderId: string | undefined;
  if (paymentMethod === "card") {
    const result = await createUplefOrder({
      amount: total,
      currency: "USD",
      externalOrderId,
      email: user.email,
      name: user.name || (user.username.startsWith("guest_") ? "Guest" : user.username),
      successUrl,
      failureUrl,
    });
    if ("error" in result) return res.status(result.status).json({ error: "Failed to create payment", details: result.error });
    paymentUrl = result.url;
    uplefOrderId = result.orderId;
  } else {
    const result = await createCryptomusInvoice({
      amount: total,
      orderId: externalOrderId,
      successUrl,
      callbackUrl: `${apiUrl()}/api/webhooks/cryptomus`,
      returnUrl: failureUrl,
    });
    if ("error" in result) return res.status(502).json({ error: "Crypto payment unavailable", details: result.error });
    paymentUrl = result.url;
  }

  const ip = clientIp(req);
  const geo = await getGeoLocation(ip);
  // One INSERT, so either every order is created or none is (D1 has no interactive transactions)
  const orders = await prisma.order.createManyAndReturn({
    data: priced.map((item) => ({
      userId: user.id,
      email,
      amount: item.amount,
      price: item.price,
      service: item.service,
      platform: item.platform,
      username: item.link,
      details: item.details as object | undefined,
      status: "PENDING",
      paymentMethod: paymentMethod === "card" ? "CARD" : "CRYPTO",
      externalOrderId,
      uplefOrderId,
      ipAddress: ip,
      ipCity: geo?.city,
      ipCountry: geo?.country,
      ipRegion: geo?.region,
      ipLatitude: geo?.lat,
      ipLongitude: geo?.lon,
    })),
    select: publicOrderSelect,
  });

  res.status(201).json({ message: "Orders created successfully", orders, paymentUrl, externalOrderId, totalAmount: total });
});

// ========== Payment webhooks ==========
/** Marks orders (or a pay-link transaction) paid or failed. Cart is only cleared once payment succeeds. */
async function applyPaymentResult(ref: { externalOrderId?: string; uplefOrderId?: string }, paid: boolean) {
  const where = ref.uplefOrderId ? { uplefOrderId: ref.uplefOrderId } : { externalOrderId: ref.externalOrderId };
  const orders = await prisma.order.findMany({ where, select: { userId: true } });
  if (orders.length) {
    // Only PENDING orders move: a repeated or late webhook must not reopen or cancel an order already handled
    const { count } = await prisma.order.updateMany({
      where: { ...where, status: "PENDING" },
      data: { status: paid ? "PROGRESS" : "CANCELED" },
    });
    if (paid && count > 0) {
      await prisma.cartItem.deleteMany({ where: { userId: { in: [...new Set(orders.map((o) => o.userId))] } } });
    }
  }

  const gatewayOrderId = ref.uplefOrderId ?? ref.externalOrderId;
  const transaction = gatewayOrderId
    ? await prisma.linkTransaction.findUnique({ where: { gatewayOrderId }, include: { paymentLink: true } })
    : null;
  if (transaction) {
    const { count } = await prisma.linkTransaction.updateMany({
      where: { id: transaction.id, status: "PENDING" },
      data: { status: paid ? "SUCCESS" : "FAILED" },
    });
    if (paid && count > 0) {
      const link = transaction.paymentLink;
      const successCount = await prisma.linkTransaction.count({ where: { paymentLinkId: link.id, status: "SUCCESS" } });
      const exhausted = link.type === "ONE_TIME" || (link.maxPayments != null && successCount >= link.maxPayments);
      if (exhausted) await prisma.paymentLink.update({ where: { id: link.id }, data: { status: "COMPLETED" } });
    }
  }
  return orders.length > 0 || !!transaction;
}

app.post("/api/webhooks/uplef", async (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error("WEBHOOK_SECRET is not defined");
    return res.status(500).send("Webhook secret missing");
  }

  const header = String(req.headers["x-uplef-signature"] ?? "").replace(/^sha256=/, "");
  const expected = crypto.createHmac("sha256", secret).update(req.rawBody ?? Buffer.alloc(0)).digest("hex");
  if (!header || !safeEqual(header, expected)) {
    console.warn("Invalid Uplef webhook signature");
    return res.status(401).send("Invalid signature");
  }

  const { event, data } = req.body ?? {};
  const uplefOrderId = typeof data?.orderId === "string" ? data.orderId : undefined;
  if (uplefOrderId && (event === "payment.success" || event === "payment.failed")) {
    await applyPaymentResult({ uplefOrderId }, event === "payment.success");
    console.log(`Uplef webhook: ${event} for ${uplefOrderId}`);
  }
  res.status(200).send("OK");
});

app.post("/api/webhooks/cryptomus", async (req, res) => {
  const apiKey = process.env.CRYPTOMUS_API_KEY;
  if (!apiKey) {
    console.error("CRYPTOMUS_API_KEY is not set");
    return res.status(500).send("Crypto webhook not configured");
  }

  const payload = (req.body ?? {}) as Record<string, unknown>;
  const incomingSign = typeof payload.sign === "string" ? payload.sign : "";
  const { sign: _sign, ...bodyWithoutSign } = payload;
  // Cryptomus signs PHP-encoded JSON (escaped slashes); also accept plain JSON encoding
  const valid =
    !!incomingSign &&
    (safeEqual(incomingSign, md5Sign(phpJsonEncode(bodyWithoutSign), apiKey)) ||
      safeEqual(incomingSign, md5Sign(JSON.stringify(bodyWithoutSign), apiKey)));
  if (!valid) {
    console.warn("Invalid Cryptomus webhook signature");
    return res.status(401).send("Invalid signature");
  }

  const orderId = typeof payload.order_id === "string" ? payload.order_id : "";
  const status = String(payload.status ?? "");
  console.log(`Cryptomus webhook: status=${status}, order_id=${orderId}`);

  if (status === "paid" || status === "paid_over") {
    // Make sure the invoice amount matches what the orders cost
    const orders = await prisma.order.findMany({ where: { externalOrderId: orderId }, select: { price: true } });
    const expected = round2(orders.reduce((sum, o) => sum + o.price, 0));
    const invoiceAmount = parseFloat(String(payload.amount ?? ""));
    if (orders.length && Number.isFinite(invoiceAmount) && invoiceAmount + 0.01 < expected) {
      console.warn(`Cryptomus: amount mismatch for ${orderId} (invoice ${invoiceAmount}, expected ${expected})`);
      return res.status(200).send("OK");
    }
    await applyPaymentResult({ externalOrderId: orderId }, true);
  } else if (["cancel", "wrong_amount", "fail", "system_fail"].includes(status)) {
    await applyPaymentResult({ externalOrderId: orderId }, false);
  }
  res.status(200).send("OK");
});

// ========== Support tickets and reviews ==========
app.post("/api/tickets", formLimiter, async (req, res) => {
  const parsed = ticketSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const ticket = await prisma.ticket.create({
    data: {
      ...parsed.data,
      email: normalizeEmail(parsed.data.email),
      orderNumber: parsed.data.orderNumber || null,
      userId: req.user?.id ?? null,
    },
  });
  res.status(201).json({ message: "Ticket received", ticketId: ticket.id });
});

app.post("/api/reviews", formLimiter, async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  await prisma.review.create({ data: { ...parsed.data, email: normalizeEmail(parsed.data.email) } });
  res.status(201).json({ message: "Thanks! Your review will appear after moderation." });
});

// ========== YouTube channel search (Get Started page suggestions only) ==========
app.get("/api/youtube/search", limiter(120), async (req, res) => {
  const q = req.query.q;
  if (!q || typeof q !== "string" || q.length > 100) return res.json([]);

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "YouTube API key not configured" });

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&key=${apiKey}&maxResults=5`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`YouTube API returned ${response.status}: ${await response.text()}`);

    const data = (await response.json()) as {
      items?: Array<{ id: { channelId: string }; snippet: { title: string; thumbnails: { default: { url: string } }; description: string } }>;
    };
    res.json(
      data.items?.map((item) => ({
        id: item.id.channelId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        description: item.snippet.description,
      })) ?? []
    );
  } catch (error) {
    console.error("YouTube Search Error:", error);
    res.status(502).json({ error: "Failed to search YouTube" });
  }
});

// ========== CTA actions status: per-user overrides, falling back to global settings ==========
app.get("/api/cta-actions/status", async (req, res) => {
  const status: Record<string, boolean> = { add_to_cart: true, buy: true, submit_ticket: true };
  try {
    for (const o of await prisma.ctaAction.findMany({ select: { actionKey: true, isActive: true } })) {
      status[o.actionKey] = o.isActive;
    }
    if (req.user) {
      const overrides = await prisma.userCtaAction.findMany({
        where: { userId: req.user.id },
        select: { actionKey: true, isActive: true },
      });
      for (const o of overrides) status[o.actionKey] = o.isActive;
    }
  } catch (err) {
    console.error("CTA actions status error:", err);
  }
  // Normalize keys for frontend compatibility
  if (status.buy_now !== undefined) status.buy = status.buy_now;
  if (status.support_tickets !== undefined) status.submit_ticket = status.support_tickets;
  res.json(status);
});

// ========== Pay-via-Link ==========
app.post("/api/payment-links", requireAuth, async (req, res) => {
  if (await rejectIfBanned(req.user!.id, res)) return;
  const parsed = paymentLinkSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);

  const token = crypto.randomBytes(32).toString("hex");
  const paymentLink = await prisma.paymentLink.create({
    data: {
      ...parsed.data,
      customerEmail: parsed.data.customerEmail ? normalizeEmail(parsed.data.customerEmail) : undefined,
      merchantId: req.user!.id,
      token,
      status: "ACTIVE",
    },
  });
  res.status(201).json({ link_url: `${firstFrontendUrl()}/pay/${token}`, link_id: paymentLink.id, expiry: paymentLink.expiry });
});

function linkUnavailableReason(link: { status: string; expiry: Date | null }) {
  if (link.expiry && new Date() > link.expiry) return { status: 410, error: "Payment link has expired" };
  if (link.status !== "ACTIVE") return { status: 400, error: `This payment link is ${link.status.toLowerCase()}` };
  return null;
}

// Public view of a payment link: only what the payer needs to see
app.get("/api/payment-links/:token", async (req, res) => {
  const link = await prisma.paymentLink.findUnique({
    where: { token: String(req.params.token) },
    select: {
      id: true,
      amount: true,
      currency: true,
      description: true,
      customerName: true,
      customerEmail: true,
      expiry: true,
      type: true,
      status: true,
      merchant: { select: { name: true, username: true } },
    },
  });
  if (!link) return res.status(404).json({ error: "Payment link not found" });

  const unavailable = linkUnavailableReason(link);
  if (unavailable) {
    if (unavailable.status === 410 && link.status === "ACTIVE") {
      await prisma.paymentLink.update({ where: { id: link.id }, data: { status: "EXPIRED" } });
    }
    return res.status(unavailable.status).json({ error: unavailable.error });
  }
  const { id: _id, ...publicLink } = link;
  res.json(publicLink);
});

app.get("/api/merchant/payment-links", requireAuth, async (req, res) => {
  const links = await prisma.paymentLink.findMany({
    where: { merchantId: req.user!.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } }, transactions: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  res.json(links);
});

app.post("/api/payment-links/:id/disable", requireAuth, async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return res.status(400).json({ error: "Invalid link ID" });
  const { count } = await prisma.paymentLink.updateMany({
    where: { id: id.data, merchantId: req.user!.id },
    data: { status: "CANCELLED" },
  });
  if (!count) return res.status(404).json({ error: "Payment link not found" });
  res.json({ message: "Payment link disabled" });
});

app.post("/api/payment-links/:token/pay", orderLimiter, async (req, res) => {
  const parsed = payLinkSchema.safeParse(req.body);
  if (!parsed.success) return badRequest(res, parsed.error);
  const { paymentMethod } = parsed.data;
  const email = normalizeEmail(parsed.data.email);

  const link = await prisma.paymentLink.findUnique({ where: { token: String(req.params.token) } });
  if (!link) return res.status(404).json({ error: "Payment link not found" });
  const unavailable = linkUnavailableReason(link);
  if (unavailable) return res.status(unavailable.status).json({ error: unavailable.error });

  const successCount = await prisma.linkTransaction.count({ where: { paymentLinkId: link.id, status: "SUCCESS" } });
  if ((link.type === "ONE_TIME" && successCount > 0) || (link.maxPayments != null && successCount >= link.maxPayments)) {
    return res.status(400).json({ error: "This payment link has already been used" });
  }

  const externalOrderId = `LINK_${link.id}_${crypto.randomUUID()}`;
  const successUrl = link.redirectUrl || `${firstFrontendUrl()}/payment/success`;
  const failureUrl = `${firstFrontendUrl()}/payment/failure`;

  let paymentUrl: string;
  let gatewayOrderId: string;
  if (paymentMethod === "crypto") {
    const result = await createCryptomusInvoice({
      amount: link.amount,
      orderId: externalOrderId,
      successUrl,
      callbackUrl: `${apiUrl()}/api/webhooks/cryptomus`,
      returnUrl: failureUrl,
    });
    if ("error" in result) return res.status(502).json({ error: result.error });
    paymentUrl = result.url;
    gatewayOrderId = externalOrderId;
  } else {
    const result = await createUplefOrder({
      amount: link.amount,
      currency: link.currency,
      externalOrderId,
      email,
      name: link.customerName || "Customer",
      successUrl,
      failureUrl,
    });
    if ("error" in result) return res.status(result.status).json({ error: result.error });
    paymentUrl = result.url;
    gatewayOrderId = result.orderId;
  }

  await prisma.linkTransaction.create({
    data: {
      paymentLinkId: link.id,
      gatewayOrderId,
      amount: link.amount,
      customerEmail: email,
      status: "PENDING",
      metadata: { externalOrderId, paymentMethod },
    },
  });
  res.json({ paymentUrl });
});

// ========== Health ==========
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (err) {
    console.error("Health check DB error:", err);
    res.status(503).json({ ok: false, error: "Database unavailable" });
  }
});

app.use("/api/admin", adminRouter);

// Unknown API routes get JSON, not Express's HTML page
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler for async routes and bad JSON bodies
app.use((err: Error & { type?: string; status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });
  if (err.type === "entity.too.large") return res.status(413).json({ error: "Request body too large" });
  // Two signups racing for the same email or username: the unique index lets only one through
  if ((err as { code?: string }).code === "P2002") return res.status(409).json({ error: "Email or username already exists" });
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
