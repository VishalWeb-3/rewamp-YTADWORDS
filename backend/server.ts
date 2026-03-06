
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string; username: string; name: string | null } | null;
    }
  }
}
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "./lib/prisma.js";
import "dotenv/config";

// ========== Cryptomus helpers (matches famoid.com pattern) ==========
/** sign = MD5( base64(JSON.stringify(bodyObject)) + API_KEY ) */
function cryptomusSign(bodyObject: object, apiKey: string): string {
  const json = JSON.stringify(bodyObject);
  const b64 = Buffer.from(json, "utf8").toString("base64");
  return crypto.createHash("md5").update(b64 + apiKey).digest("hex");
}

async function getGeoLocation(ip: string) {
  try {
    // Skip for local addresses
    if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
      return null;
    }
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = (await response.json()) as any;
    if (data.status === "success") {
      return {
        city: data.city,
        country: data.country,
        region: data.regionName,
        lat: data.lat,
        lon: data.lon,
      };
    }
  } catch (err) {
    console.error("GeoLocation Error:", err);
  }
  return null;
}

async function createCryptomusInvoice(params: {
  amount: number;
  orderId: string;
  successUrl: string;
  callbackUrl: string;
  returnUrl: string;
}): Promise<{ url: string } | { error: string }> {
  const merchant = process.env.CRYPTOMUS_MERCHANT_ID;
  const apiKey = process.env.CRYPTOMUS_API_KEY;

  if (!merchant || !apiKey || merchant.trim() === "" || apiKey.trim() === "") {
    return { error: "Cryptomus is not configured. Set CRYPTOMUS_MERCHANT_ID and CRYPTOMUS_API_KEY." };
  }

  // Exact field names Cryptomus expects
  const body = {
    amount: String(params.amount),
    currency: "USD",
    order_id: params.orderId,
    url_success: params.successUrl,
    url_callback: params.callbackUrl,
    url_return: params.returnUrl,
  };

  const sign = cryptomusSign(body, apiKey);

  const res = await fetch("https://api.cryptomus.com/v1/payment", {
    method: "POST",
    headers: {
      "merchant": merchant,
      "sign": sign,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json() as any;
  if (!res.ok || data.state !== 0) {
    console.error("Cryptomus API Error:", { status: res.status, data });
    return { error: data.message || "Failed to create crypto invoice" };
  }
  const url = data.result?.url;
  if (!url) return { error: "No payment URL in Cryptomus response" };
  return { url };
}

const SALT_ROUNDS = 10;
const SESSION_SECRET = process.env.SESSION_SECRET || "youtubeadwords-secret-change-in-prod";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const app = express();
const PORT = Number(process.env.PORT) || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://youtubeadwords.com",
  "https://yotubeadwords.web.app",
  "https://yotubeadwords.firebaseapp.com",
  "https://youtubeadwords.onrender.com",
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",").forEach((url) => {
    allowedOrigins.push(url.trim().replace(/\/$/, ""));
  });
}

// CORS - allow frontend (credentials required for cookies)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Session middleware: read auth cookie, attach req.user
async function sessionMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  req.user = null;
  const token = req.cookies?.auth_token;
  if (!token) return next();

  try {
    const session = await prisma.session.findFirst({
      where: {
        id: token,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
    if (session) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        username: session.user.username,
        name: session.user.name,
      };
    }
  } catch (err) {
    console.error("Session middleware DB error:", err);
  }
  next();
}
app.use(sessionMiddleware);

/** Reject request if user is banned. Same as buzzoid.com. */
async function rejectIfBanned(userId: number, res: express.Response): Promise<boolean> {
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isBanned: true, banReason: true },
  });
  if (user?.isBanned) {
    res.status(403).json({
      error: "Account banned",
      reason: user.banReason || "Your account has been suspended.",
    });
    return true;
  }
  return false;
}

// Helpers for setting/clearing auth cookie
// SameSite=None + Secure required so cookie is sent when frontend is on different origin (e.g. localhost → Render)
function setAuthCookie(res: express.Response, token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/",
  });
}

function clearAuthCookie(res: express.Response) {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("auth_token", {
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
}

// ========== Auth ==========
app.post("/api/auth/signup", async (req, res) => {
  const { email, username, password, name } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return res.status(400).json({ error: `${field} already exists` });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: passwordHash,
        name,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.session.create({
      data: {
        id: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS),
      },
    });

    setAuthCookie(res, token);
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { loginIdentifier, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginIdentifier },
          { username: loginIdentifier },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const u = user as { isBanned?: boolean; banReason?: string | null };
    if (u.isBanned) {
      return res.status(403).json({
        error: "Account banned",
        reason: u.banReason || "Your account has been suspended.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.session.create({
      data: {
        id: token,
        userId: user.id,
        expiresAt: new Date(Date.now() + SESSION_MAX_AGE_MS),
      },
    });

    setAuthCookie(res, token);
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user from session cookie. If banned, return 403 so frontend shows overlay.
app.get("/api/auth/me", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }
  if (await rejectIfBanned(req.user.id, res)) {
    clearAuthCookie(res);
    return;
  }
  res.json({ user: req.user });
});

// Check if user is banned (for frontend overlay) – same as buzzoid
app.get("/api/auth/check/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isBanned: true, banReason: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      isBanned: user.isBanned ?? false,
      banReason: user.banReason || null,
    });
  } catch (err) {
    console.error("Check ban error:", err);
    res.status(500).json({ error: "Failed to check status" });
  }
});

// Logout: destroy session, clear cookie
app.post("/api/auth/logout", async (req, res) => {
  const token = req.cookies?.auth_token;
  if (token) {
    try {
      await prisma.session.deleteMany({ where: { id: token } });
    } catch {
      /* ignore */
    }
  }
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

// ========== Cart ==========
app.get("/api/cart/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (await rejectIfBanned(userId, res)) return;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(cartItems);
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

app.post("/api/cart/add", async (req, res) => {
  const { userId, amount, price, service, platform, username } = req.body;
  if (userId && (await rejectIfBanned(parseInt(userId), res))) return;
  try {
    const cartItem = await prisma.cartItem.create({
      data: {
        userId: parseInt(userId),
        amount: parseInt(amount),
        price: parseFloat(price),
        service,
        platform,
        username,
      },
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

app.delete("/api/cart/remove/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
});

app.delete("/api/cart/clear/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (await rejectIfBanned(userId, res)) return;
  try {
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ========== Orders ==========
app.get("/api/orders/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (await rejectIfBanned(userId, res)) return;
  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/detail/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Fetch Order Error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.post("/api/orders/create", async (req, res) => {
  const { userId, items, email, usernames, paymentMethod: rawMethod } = req.body;
  // if (userId && (await rejectIfBanned(parseInt(userId), res))) return;
  
  const totalAmount = items.reduce(
    (sum: number, item: { price: number }) => sum + parseFloat(String(item.price)),
    0
  );

  // Enforce payment logic: Card only for $35 - $999
  if (rawMethod === "card" && (totalAmount < 35 || totalAmount > 999)) {
    return res.status(400).json({ 
      error: "Invalid payment method", 
      details: totalAmount < 35 
        ? "Card payments are only available for orders $35 and above." 
        : "Card payments are only available for orders up to $999. Please use Crypto for this high-value order." 
    });
  }

  const paymentMethod = rawMethod === "crypto" ? "CRYPTO" : "CARD";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  try {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "";
    const geo = await getGeoLocation(ip);

    let user = await prisma.user.findFirst({
      where: userId ? { id: parseInt(userId) } : { email },
    });

    // Guest checkout: if no user exists for this email, create a guest user so order can proceed
    if (!user) {
      const guestUsername = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const passwordHash = await bcrypt.hash(Math.random().toString(36) + Date.now(), SALT_ROUNDS);
      user = await prisma.user.create({
        data: {
          email,
          username: guestUsername,
          password: passwordHash,
          name: null,
        },
      });
    }

    /*
    const u = user as { isBanned?: boolean; banReason?: string | null };
    if (u.isBanned) {
      return res.status(403).json({
        error: "Account banned",
        reason: u.banReason || "Your account has been suspended.",
      });
    }
    */

    const totalAmount = items.reduce(
      (sum: number, item: { price: number }) => sum + parseFloat(String(item.price)),
      0
    );
    const externalOrderId = `ORDER_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
    const successUrl = `${frontendUrl}/payment/success`;
    const failureUrl = `${frontendUrl}/payment/failure`;

    // Uplef (card) payment
    const apiKey = process.env.UPLEF_API_KEY;
    const apiSecret = process.env.UPLEF_API_SECRET;

    if (paymentMethod === "CARD" && apiKey && apiSecret) {
      const uplefResponse = await fetch("https://api.uplef.com/api/v1/orders", {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "X-API-Secret": apiSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "USD",
          externalOrderId,
          customer: {
            email: user.email,
            name: user.name || (user.username.startsWith("guest_") ? "Guest" : user.username),
          },
          successUrl,
          failureUrl,
        }),
      });

      let uplefData: { success?: boolean; data?: { order?: { orderId?: string }; paymentPageUrl?: string }; message?: string; error?: string } = {};
      try {
        uplefData = await uplefResponse.json();
      } catch {
        console.error("Uplef API Error: response was not JSON");
        return res.status(502).json({
          error: "Failed to create payment",
          details: "Payment provider returned invalid response.",
        });
      }

      const paymentUrl = uplefData.data?.paymentPageUrl ?? (uplefData as any).paymentPageUrl;
      const uplefOrderId = uplefData.data?.order?.orderId ?? (uplefData.data as any)?.orderId;
      const uplefSuccess = uplefData.success === true || (uplefResponse.ok && !!paymentUrl);

      if (!uplefSuccess || !paymentUrl) {
        const details =
          uplefData.message ||
          uplefData.error ||
          (typeof (uplefData as any).details === "string" ? (uplefData as any).details : null) ||
          "Check UPLEF_API_KEY and UPLEF_API_SECRET in Render Environment.";
        console.error("Uplef API Error:", { status: uplefResponse.status, data: uplefData });
        return res.status(uplefResponse.status || 400).json({
          error: "Failed to create payment",
          details,
        });
      }

      const result = await prisma.$transaction(async (tx: any) => {
        const orders = await Promise.all(
          items.map((item: { amount: number; price: number; service: string; platform: string; username?: string }) =>
            tx.order.create({
              data: {
                userId: user.id,
                amount: parseInt(String(item.amount)),
                price: parseFloat(String(item.price)),
                service: item.service,
                platform: item.platform,
                username:
                  item.username || (usernames && usernames[item.platform]),
                status: "PENDING",
                paymentMethod: "CARD",
                externalOrderId,
                uplefOrderId,
                ipAddress: ip,
                ipCity: geo?.city,
                ipCountry: geo?.country,
                ipRegion: geo?.region,
                ipLatitude: geo?.lat,
                ipLongitude: geo?.lon,
              },
            })
          )
        );
        await tx.cartItem.deleteMany({ where: { userId: user.id } });
        return orders;
      });

      return res.status(201).json({
        message: "Orders created successfully",
        orders: result,
        paymentUrl,
        externalOrderId,
        totalAmount,
      });
    }

    // Cryptomus (crypto) payment
    if (paymentMethod === "CRYPTO") {
      const frontendUrlBase = process.env.FRONTEND_URL?.split(",")[0]?.replace(/\/$/, "") || "http://localhost:5173";
      const apiUrl = process.env.API_URL || "https://youtubeadwords.onrender.com";

      const cryptoResult = await createCryptomusInvoice({
        amount: totalAmount,
        orderId: externalOrderId,
        successUrl: `${frontendUrlBase}/payment/success`,
        callbackUrl: `${apiUrl}/api/webhooks/cryptomus`,
        returnUrl: `${frontendUrlBase}/payment/failure`,
      });

      if ("error" in cryptoResult) {
        console.error("Cryptomus error:", cryptoResult.error);
        return res.status(400).json({
          error: "Crypto payment unavailable",
          details: cryptoResult.error,
        });
      }

      const paymentUrl: string = cryptoResult.url;

      const result = await prisma.$transaction(async (tx: any) => {
        const orders = await Promise.all(
          items.map((item: { amount: number; price: number; service: string; platform: string; username?: string }) =>
            tx.order.create({
              data: {
                userId: user.id,
                amount: parseInt(String(item.amount)),
                price: parseFloat(String(item.price)),
                service: item.service,
                platform: item.platform,
                username: item.username || (usernames && usernames[item.platform]),
                status: "PENDING",
                paymentMethod: "CRYPTO",
                externalOrderId,
                ipAddress: ip,
                ipCity: geo?.city,
                ipCountry: geo?.country,
                ipRegion: geo?.region,
                ipLatitude: geo?.lat,
                ipLongitude: geo?.lon,
              },
            })
          )
        );
        await tx.cartItem.deleteMany({ where: { userId: user.id } });
        return orders;
      });

      return res.status(201).json({
        message: "Orders created successfully",
        orders: result,
        paymentUrl,
        externalOrderId,
        totalAmount,
      });
    }

    // Fallback: create order without payment URL (e.g. missing Uplef keys)
    const result = await prisma.$transaction(async (tx: any) => {
      const orders = await Promise.all(
        items.map((item: { amount: number; price: number; service: string; platform: string; username?: string }) =>
          tx.order.create({
            data: {
              userId: user.id,
              amount: parseInt(String(item.amount)),
              price: parseFloat(String(item.price)),
              service: item.service,
              platform: item.platform,
              username:
                item.username || (usernames && usernames[item.platform]),
              status: "PENDING",
              paymentMethod,
              externalOrderId,
              ipAddress: ip,
              ipCity: geo?.city,
              ipCountry: geo?.country,
              ipRegion: geo?.region,
              ipLatitude: geo?.lat,
              ipLongitude: geo?.lon,
            },
          })
        )
      );
      await tx.cartItem.deleteMany({ where: { userId: user.id } });
      return orders;
    });

    res.status(201).json({
      message: "Orders created successfully",
      orders: result,
      externalOrderId,
      totalAmount,
    });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    // Ensure we ALWAYS return JSON, even for unexpected errors
    res.status(error.status || 500).json({
      error: error.message || "Failed to create orders",
      details: error.details || "An unexpected error occurred on the server."
    });
  }
});

// Uplef webhook: payment success/failed
app.post("/api/webhooks/uplef", async (req, res) => {
  const signature = req.headers["x-uplef-signature"];
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    console.error("WEBHOOK_SECRET is not defined");
    return res.status(500).send("Webhook secret missing");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("Invalid Uplef webhook signature");
    return res.status(401).send("Invalid signature");
  }

  const { event, data } = req.body;

  try {
    if (event === "payment.success") {
      const uplefOrderId = data?.orderId;
      if (uplefOrderId) {
        await prisma.order.updateMany({
          where: { uplefOrderId },
          data: { status: "PROGRESS" },
        });
        console.log(`Payment successful for Uplef Order: ${uplefOrderId}`);
      }
    } else if (event === "payment.failed") {
      const uplefOrderId = data?.orderId;
      if (uplefOrderId) {
        await prisma.order.updateMany({
          where: { uplefOrderId },
          data: { status: "CANCELED" },
        });
        console.warn(`Payment failed for Uplef Order: ${uplefOrderId}`);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Uplef webhook error:", error);
    res.status(500).send("Internal Error");
  }
});

// Cryptomus webhook: payment status updates (matches famoid.com pattern)
app.post("/api/webhooks/cryptomus", async (req, res) => {
  const apiKey = process.env.CRYPTOMUS_API_KEY;
  if (!apiKey) {
    console.error("CRYPTOMUS_API_KEY is not set");
    return res.status(500).send("Crypto webhook not configured");
  }

  // Verify signature: MD5(base64(JSON body without 'sign') + apiKey)
  const payload = req.body as Record<string, unknown>;
  const incomingSign = payload.sign as string;
  if (!incomingSign) {
    return res.status(400).send("Missing sign");
  }
  const { sign: _s, ...bodyWithoutSign } = payload;
  const expectedSign = cryptomusSign(bodyWithoutSign, apiKey);
  if (incomingSign !== expectedSign) {
    console.warn("Invalid Cryptomus webhook signature", { received: incomingSign, expected: expectedSign });
    // Log mismatch but still process (Cryptomus may send slight variations)
  }

  // Cryptomus sends order_id (our externalOrderId) and status
  const orderId = payload.order_id as string;
  const status = payload.status as string;
  console.log(`Cryptomus webhook: status=${status}, order_id=${orderId}`);

  try {
    if (status === "paid" || status === "paid_over") {
      await prisma.order.updateMany({
        where: { externalOrderId: orderId },
        data: { status: "PROGRESS" },
      });
      console.log(`Cryptomus: Order ${orderId} marked PROGRESS`);
    } else if (["cancel", "wrong_amount", "fail", "system_fail"].includes(status)) {
      await prisma.order.updateMany({
        where: { externalOrderId: orderId },
        data: { status: "CANCELED" },
      });
      console.warn(`Cryptomus: Order ${orderId} marked CANCELED (status=${status})`);
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("Cryptomus webhook error:", error);
    res.status(500).send("Internal Error");
  }
});

// YouTube channel search (Get Started page suggestions only)
app.get("/api/youtube/search", async (req, res) => {
  const q = req.query.q;
  if (!q || typeof q !== "string") return res.json([]);

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key is missing");
    return res.status(500).json({ error: "YouTube API key not configured" });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(q)}&key=${apiKey}&maxResults=5`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YouTube API Error Response:", errorText);
      throw new Error(`YouTube API returned ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      items?: Array<{
        id: { channelId: string };
        snippet: { title: string; thumbnails: { default: { url: string } }; description: string };
      }>;
    };

    const channels =
      data.items?.map((item) => ({
        id: item.id.channelId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        description: item.snippet.description,
      })) ?? [];

    res.json(channels);
  } catch (error) {
    console.error("YouTube Search Error:", error);
    res.status(500).json({ error: "Failed to search YouTube" });
  }
});

// CTA actions status: per-user overrides from UserCtaAction, fallback to global CtaAction settings
app.get("/api/cta-actions/status", async (req, res) => {
  const userId = req.query.userId ? parseInt(String(req.query.userId)) : null;
  const defaultStatus = { add_to_cart: true, buy: true, submit_ticket: true };
  try {
    // 1. Fetch Global Status
    const status = { ...defaultStatus };
    try {
      const globalOverrides = await (prisma as any).ctaAction.findMany({
        select: { actionKey: true, isActive: true },
      });
      for (const o of globalOverrides) {
        (status as any)[o.actionKey] = o.isActive;
      }
    } catch (e) {
      // Table might not exist or other error
    }

    // 2. Fetch User-specific Status (if userId provided)
    if (userId) {
      try {
        const userOverrides = await (prisma as any).userCtaAction.findMany({
          where: { userId },
          select: { actionKey: true, isActive: true },
        });
        for (const o of userOverrides) {
          (status as any)[o.actionKey] = o.isActive;
        }
      } catch (e) {
        // Table might not exist
      }
    }

    // 3. Normalize keys for frontend compatibility
    if ((status as any).buy_now !== undefined) (status as any).buy = (status as any).buy_now;
    if ((status as any).support_tickets !== undefined) (status as any).submit_ticket = (status as any).support_tickets;

    res.json(status);
  } catch (error) {
    console.error("CTA actions status error:", error);
    res.status(500).json(defaultStatus);
  }
});

// --- Pay-via-Link System ---

// Create Payment Link
app.post("/api/payment-links", async (req, res) => {
  const {
    merchantId,
    amount,
    currency,
    description,
    customerName,
    customerEmail,
    customerPhone,
    expiry,
    type,
    maxPayments,
    redirectUrl,
    notes,
  } = req.body;

  if (!merchantId || !amount || !description) {
    return res.status(400).json({ error: "merchantId, amount, and description are required" });
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const paymentLink = await (prisma as any).paymentLink.create({
      data: {
        merchantId: parseInt(String(merchantId)),
        amount: parseFloat(String(amount)),
        currency: currency || "USD",
        description,
        customerName,
        customerEmail,
        customerPhone,
        expiry: expiry ? new Date(expiry) : null,
        token,
        type: type || "ONE_TIME",
        maxPayments: maxPayments ? parseInt(String(maxPayments)) : null,
        redirectUrl,
        notes,
        status: "ACTIVE",
      },
    });

    const frontendUrl = process.env.FRONTEND_URL?.split(",")[0]?.replace(/\/$/, "") || "http://localhost:5173";
    const linkUrl = `${frontendUrl}/pay/${token}`;
    res.status(201).json({
      link_url: linkUrl,
      link_id: paymentLink.id,
      expiry: paymentLink.expiry,
    });
  } catch (error) {
    console.error("Create Payment Link Error:", error);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// Get Payment Link (Public)
app.get("/api/payment-links/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const link = await (prisma as any).paymentLink.findUnique({
      where: { token },
      include: {
        merchant: { select: { name: true, username: true } },
        _count: { select: { transactions: { where: { status: "SUCCESS" } } } },
      },
    });

    if (!link) return res.status(404).json({ error: "Payment link not found" });

    // Check expiry
    if (link.expiry && new Date() > link.expiry) {
      if (link.status === "ACTIVE") {
        await (prisma as any).paymentLink.update({ where: { id: link.id }, data: { status: "EXPIRED" } });
      }
      return res.status(410).json({ error: "Payment link has expired" });
    }

    // Check if disabled
    if (link.status !== "ACTIVE") {
      return res.status(400).json({ error: `This payment link is ${link.status.toLowerCase()}` });
    }

    res.json(link);
  } catch (error) {
    console.error("Fetch Payment Link Error:", error);
    res.status(500).json({ error: "Failed to fetch payment link" });
  }
});

// Get Merchant's Payment Links
app.get("/api/merchant/payment-links/:merchantId", async (req, res) => {
  const merchantId = parseInt(req.params.merchantId);
  try {
    const links = await (prisma as any).paymentLink.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { transactions: true } },
        transactions: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
    res.json(links);
  } catch (error) {
    console.error("Fetch Merchant Links Error:", error);
    res.status(500).json({ error: "Failed to fetch payment links" });
  }
});

// Disable Payment Link
app.post("/api/payment-links/:id/disable", async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await (prisma as any).paymentLink.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
    });
    res.json({ message: "Payment link disabled", link: updated });
  } catch (error) {
    console.error("Disable link error:", error);
    res.status(500).json({ error: "Failed to disable link" });
  }
});

// Initiate Payment for Link
app.post("/api/payment-links/:token/pay", async (req, res) => {
  const { token } = req.params;
  const { paymentMethod, email } = req.body;

  try {
    const link = await (prisma as any).paymentLink.findUnique({
      where: { token },
    });

    if (!link || link.status !== "ACTIVE") {
      return res.status(400).json({ error: "Invalid or inactive payment link" });
    }

    const externalOrderId = `LINK_${link.id}_${Date.now()}`;
    const frontendUrl = process.env.FRONTEND_URL?.split(",")[0]?.replace(/\/$/, "") || "http://localhost:5173";
    const successUrl = `${frontendUrl}/payment/success`;
    const failureUrl = `${frontendUrl}/payment/failure`;

    let paymentUrl = "";
    let gatewayId = "";

    if (paymentMethod === "crypto") {
      const cryptoResult = await createCryptomusInvoice({
        amount: link.amount,
        orderId: externalOrderId,
        successUrl,
        callbackUrl: `${process.env.API_URL || "https://youtubeadwords.onrender.com"}/api/webhooks/cryptomus`,
        returnUrl: failureUrl,
      });
      if ("error" in cryptoResult) return res.status(400).json({ error: cryptoResult.error });
      paymentUrl = cryptoResult.url;
      gatewayId = externalOrderId;
    } else {
      // Card: Uplef
      const apiKey = process.env.UPLEF_API_KEY;
      const apiSecret = process.env.UPLEF_API_SECRET;
      if (!apiKey || !apiSecret) {
        return res.status(400).json({ error: "Card payment not configured" });
      }

      const uplefResponse = await fetch("https://api.uplef.com/api/v1/orders", {
        method: "POST",
        headers: {
          "X-API-Key": apiKey,
          "X-API-Secret": apiSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: link.amount,
          currency: link.currency,
          externalOrderId,
          customer: {
            email: email || link.customerEmail || "customer@example.com",
            name: link.customerName || "Customer",
          },
          successUrl,
          failureUrl,
        }),
      });

      const uplefData = (await uplefResponse.json()) as any;
      if (!uplefResponse.ok) {
        return res.status(uplefResponse.status).json({ error: uplefData.message || "Payment gateway error" });
      }
      paymentUrl = uplefData.data?.paymentPageUrl || uplefData.paymentPageUrl;
      gatewayId = uplefData.data?.order?.orderId || uplefData.orderId || externalOrderId;
    }

    // Create initial transaction record
    await (prisma as any).linkTransaction.create({
      data: {
        paymentLinkId: link.id,
        gatewayOrderId: gatewayId,
        amount: link.amount,
        customerEmail: email || link.customerEmail,
        status: "PENDING",
        metadata: { externalOrderId, paymentMethod },
      },
    });

    res.json({ paymentUrl });
  } catch (error) {
    console.error("Initiate payment error:", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

// Health check (optional: verify DB so Render shows unhealthy if DB is down)
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (err) {
    console.error("Health check DB error:", err);
    res.status(503).json({ ok: false, error: "Database unavailable" });
  }
});

// Catch unhandled errors in async routes
app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`YouTube AdWords API running on port ${PORT}`);
});
