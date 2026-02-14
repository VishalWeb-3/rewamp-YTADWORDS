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

const SALT_ROUNDS = 10;
const SESSION_SECRET = process.env.SESSION_SECRET || "youtubeadwords-secret-change-in-prod";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const app = express();
const PORT = process.env.PORT || 5001;

// CORS - allow frontend (credentials required for cookies)
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173",
      "http://localhost:5173",
    ],
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

// Get current user from session cookie
app.get("/api/auth/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.user });
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
  const { userId } = req.params;
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(userId) },
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
  const { userId } = req.params;
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: parseInt(userId) },
    });
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

// ========== Orders ==========
app.get("/api/orders/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
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
  const paymentMethod = rawMethod === "crypto" ? "CRYPTO" : "CARD";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  try {
    let user =
      userId != null && userId !== ""
        ? await prisma.user.findFirst({ where: { id: parseInt(String(userId), 10) } })
        : null;
    if (!user) {
      user = await prisma.user.findFirst({ where: { email } });
    }
    if (!user) {
      const guestUsername = `guest_${email.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}_${Date.now()}`;
      user = await prisma.user.create({
        data: {
          email,
          username: guestUsername,
          password: await bcrypt.hash(crypto.randomBytes(32).toString("hex"), SALT_ROUNDS),
        },
      });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
          customer: { email: user.email, name: user.name || user.username },
          successUrl,
          failureUrl,
        }),
      });

      const uplefData = await uplefResponse.json();
      if (!uplefResponse.ok || !uplefData.success) {
        console.error("Uplef API Error:", { status: uplefResponse.status, data: uplefData });
        return res.status(uplefResponse.status || 400).json({
          error: "Failed to create payment",
          details: uplefData.message || "Check your Uplef API keys in .env",
        });
      }

      const uplefOrderId = uplefData.data?.order?.orderId;
      const paymentUrl = uplefData.data?.paymentPageUrl;

      const result = await prisma.$transaction(async (tx) => {
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
    const result = await prisma.$transaction(async (tx) => {
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
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ error: "Failed to create orders" });
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
