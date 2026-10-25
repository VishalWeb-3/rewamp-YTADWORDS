import crypto from "crypto";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "../app.js";
import { prisma } from "../lib/prisma.js";
import { parseQuantity, priceItem } from "../lib/catalog.js";

// Payment gateways and geolocation are external: answer them locally
const realFetch = globalThis.fetch;
vi.stubGlobal("fetch", async (input: string | URL | Request, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  if (url.startsWith("https://api.cryptomus.com")) {
    return new Response(JSON.stringify({ state: 0, result: { url: "https://pay.cryptomus.test/invoice" } }));
  }
  if (url.startsWith("https://api.uplef.com")) {
    return new Response(
      JSON.stringify({ success: true, data: { paymentPageUrl: "https://pay.uplef.test/p", order: { orderId: "UPLEF_1" } } })
    );
  }
  if (url.startsWith("https://ipwho.is")) return new Response(JSON.stringify({ success: false }));
  return realFetch(input, init);
});

const viewsItem = { slug: "buy-youtube-views", tier: "regular", quantity: "5.0K", link: "https://youtu.be/dQw4w9WgXcQ" };

async function signup(email: string, username: string) {
  const agent = request.agent(app);
  const res = await agent.post("/api/auth/signup").send({ email, username, password: "password123" });
  expect(res.status).toBe(201);
  return { agent, user: res.body.user as { id: number } };
}

function cryptomusSign(body: Record<string, unknown>) {
  const json = JSON.stringify(body).replace(/\//g, "\\/");
  return crypto.createHash("md5").update(Buffer.from(json).toString("base64") + "test-cryptomus-key").digest("hex");
}

beforeAll(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE "LinkTransaction", "PaymentLink", "Ticket", "Review", "Order", "CartItem", "Session", "UserCtaAction", "CtaAction", "User" RESTART IDENTITY CASCADE'
  );
});

beforeEach(() => {
  delete process.env.UPLEF_API_KEY;
  delete process.env.UPLEF_API_SECRET;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("catalog", () => {
  it("parses abbreviated quantities", () => {
    expect(parseQuantity("5.0K")).toBe(5000);
    expect(parseQuantity("50k")).toBe(50000);
    expect(parseQuantity("1.0M")).toBe(1_000_000);
    expect(parseQuantity("100")).toBe(100);
    expect(parseQuantity("abc")).toBeNaN();
  });

  it("prices packages from the catalog, not from the request", () => {
    expect(priceItem({ slug: "buy-youtube-views", tier: "regular", quantity: "5.0K" })).toMatchObject({ amount: 5000, price: 19.78 });
    expect(() => priceItem({ slug: "buy-youtube-views", tier: "regular", quantity: "123" })).toThrow();
  });

  it("adds Google review add-on surcharges", () => {
    const base = priceItem({ kind: "google-reviews", slug: "buy-female-google-reviews", paymentType: "one-time", reviewType: "5-star", reviews: 10 });
    const withAddOn = priceItem({
      kind: "google-reviews",
      slug: "buy-female-google-reviews",
      paymentType: "one-time",
      reviewType: "5-star",
      reviews: 10,
      addOns: { verifiedReviewers: true },
    });
    expect(withAddOn.price).toBeCloseTo(base.price * 1.4, 2);
  });
});

describe("auth", () => {
  it("rejects signup without a password with 400, not 500", async () => {
    const res = await request(app).post("/api/auth/signup").send({ email: "carol.test@gmail.com", username: "carol" });
    expect(res.status).toBe(400);
  });

  it("logs in with a differently-cased email", async () => {
    await signup("Alice.Test@gmail.com", "alice");
    const res = await request(app).post("/api/auth/login").send({ loginIdentifier: "ALICE.test@gmail.com", password: "password123" });
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe("alice.test@gmail.com");
  });

  it("rejects login with a missing identifier", async () => {
    const res = await request(app).post("/api/auth/login").send({ password: "password123" });
    expect(res.status).toBe(400);
  });

  it("no longer exposes the user-enumeration endpoint", async () => {
    const res = await request(app).get("/api/auth/check/1");
    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toMatch(/json/);
  });
});

describe("cart and orders require login and ownership", () => {
  it("blocks anonymous access", async () => {
    expect((await request(app).get("/api/cart")).status).toBe(401);
    expect((await request(app).post("/api/cart/add").send({})).status).toBe(401);
    expect((await request(app).get("/api/orders")).status).toBe(401);
    expect((await request(app).get("/api/orders/detail/1")).status).toBe(401);
  });

  it("keeps each user's cart and orders private", async () => {
    const a = await signup("owner.test@gmail.com", "owner");
    const b = await signup("other.test@gmail.com", "other");
    const add = await a.agent.post("/api/cart/add").send({ amount: 100, price: 1.34, service: "Views", platform: "YouTube" });
    expect(add.status).toBe(201);

    expect((await b.agent.get("/api/cart")).body).toEqual([]);
    expect((await b.agent.delete(`/api/cart/remove/${add.body.id}`)).status).toBe(404);

    const order = await a.agent.post("/api/orders/create").send({ email: "owner.test@gmail.com", items: [viewsItem], paymentMethod: "crypto" });
    expect(order.status).toBe(201);
    const orderId = order.body.orders[0].id;
    expect((await b.agent.get(`/api/orders/detail/${orderId}`)).status).toBe(404);
    expect((await a.agent.get(`/api/orders/detail/${orderId}`)).status).toBe(200);
    expect(order.body.orders[0].ipAddress).toBeUndefined();
  });
});

describe("order creation", () => {
  it("ignores browser prices and parses 5.0K as 5000", async () => {
    const res = await request(app)
      .post("/api/orders/create")
      .send({ email: "buyer.one@gmail.com", items: [{ ...viewsItem, price: 0.01, amount: 100000 }], paymentMethod: "crypto" });
    expect(res.status).toBe(201);
    expect(res.body.totalAmount).toBe(19.78);
    expect(res.body.orders[0]).toMatchObject({ amount: 5000, price: 19.78, status: "PENDING" });
    expect(res.body.externalOrderId).toMatch(/^ORDER_[0-9a-f-]{36}$/);
  });

  it("rejects unknown packages and payment methods", async () => {
    const badPkg = await request(app)
      .post("/api/orders/create")
      .send({ email: "buyer.two@gmail.com", items: [{ ...viewsItem, quantity: "123" }], paymentMethod: "crypto" });
    expect(badPkg.status).toBe(400);

    const badMethod = await request(app)
      .post("/api/orders/create")
      .send({ email: "buyer.two@gmail.com", items: [viewsItem], paymentMethod: "paypal" });
    expect(badMethod.status).toBe(400);
  });

  it("refuses card orders when the card gateway is not configured", async () => {
    const res = await request(app)
      .post("/api/orders/create")
      .send({ email: "buyer.three@gmail.com", items: [{ ...viewsItem, slug: "buy-youtube-subscribers", quantity: "1.0K" }], paymentMethod: "card" });
    expect(res.status).toBe(503);
    expect(await prisma.order.count({ where: { email: "buyer.three@gmail.com" } })).toBe(0);
  });

  it("enforces the card amount limits", async () => {
    process.env.UPLEF_API_KEY = "k";
    process.env.UPLEF_API_SECRET = "s";
    const res = await request(app).post("/api/orders/create").send({ email: "buyer.four@gmail.com", items: [viewsItem], paymentMethod: "card" });
    expect(res.status).toBe(400);
  });

  it("does not attach a guest order to a registered account", async () => {
    await signup("registered.test@gmail.com", "registered");
    const res = await request(app).post("/api/orders/create").send({ email: "registered.test@gmail.com", items: [viewsItem], paymentMethod: "crypto" });
    expect(res.status).toBe(409);
  });

  it("lets a guest buyer claim their account at signup", async () => {
    await request(app).post("/api/orders/create").send({ email: "guest.buyer@gmail.com", items: [viewsItem], paymentMethod: "crypto" }).expect(201);
    const { agent } = await signup("guest.buyer@gmail.com", "realbuyer");
    const orders = await agent.get("/api/orders");
    expect(orders.body).toHaveLength(1);
  });

  it("blocks banned users from ordering", async () => {
    const { agent, user } = await signup("banned.test@gmail.com", "banneduser");
    await prisma.user.update({ where: { id: user.id }, data: { isBanned: true } });
    const res = await agent.post("/api/orders/create").send({ email: "banned.test@gmail.com", items: [viewsItem], paymentMethod: "crypto" });
    expect(res.status).toBe(403);
  });

  it("quotes prices from the catalog", async () => {
    const res = await request(app).post("/api/orders/quote").send({ items: [{ slug: "buy-youtube-views", quantity: "5.0K" }] });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ totalAmount: 19.78, cardAvailable: false });
  });
});

describe("payment webhooks", () => {
  async function pendingOrder(email: string) {
    const res = await request(app).post("/api/orders/create").send({ email, items: [viewsItem], paymentMethod: "crypto" });
    return res.body.externalOrderId as string;
  }

  it("rejects a forged Cryptomus webhook", async () => {
    const orderId = await pendingOrder("forge.test@gmail.com");
    const res = await request(app).post("/api/webhooks/cryptomus").send({ order_id: orderId, status: "paid", sign: "forged" });
    expect(res.status).toBe(401);
    expect((await request(app).get(`/api/orders/status/${orderId}`)).body.status).toBe("PENDING");
  });

  it("accepts a correctly signed Cryptomus webhook", async () => {
    const orderId = await pendingOrder("signed.test@gmail.com");
    const body = { order_id: orderId, status: "paid", amount: "19.78", url: "https://x.test/a" };
    const res = await request(app).post("/api/webhooks/cryptomus").send({ ...body, sign: cryptomusSign(body) });
    expect(res.status).toBe(200);
    expect((await request(app).get(`/api/orders/status/${orderId}`)).body.status).toBe("PAID");
  });

  it("ignores a signed webhook whose amount is too low", async () => {
    const orderId = await pendingOrder("underpaid.test@gmail.com");
    const body = { order_id: orderId, status: "paid", amount: "0.01" };
    await request(app).post("/api/webhooks/cryptomus").send({ ...body, sign: cryptomusSign(body) }).expect(200);
    expect((await request(app).get(`/api/orders/status/${orderId}`)).body.status).toBe("PENDING");
  });

  it("verifies the Uplef signature over the raw body", async () => {
    const raw = JSON.stringify({ event: "payment.success", data: { orderId: "UPLEF_X" } });
    const good = crypto.createHmac("sha256", "test-webhook-secret").update(raw).digest("hex");
    const ok = await request(app).post("/api/webhooks/uplef").set("Content-Type", "application/json").set("x-uplef-signature", good).send(raw);
    expect(ok.status).toBe(200);
    const bad = await request(app).post("/api/webhooks/uplef").set("Content-Type", "application/json").set("x-uplef-signature", "nope").send(raw);
    expect(bad.status).toBe(401);
  });
});

describe("payment links", () => {
  it("requires login to create, list or disable links", async () => {
    expect((await request(app).post("/api/payment-links").send({ amount: 10, description: "x" })).status).toBe(401);
    expect((await request(app).get("/api/merchant/payment-links")).status).toBe(401);
    expect((await request(app).post("/api/payment-links/1/disable")).status).toBe(401);
  });

  it("only lets the owner disable a link, and hides private fields", async () => {
    const owner = await signup("merchant.test@gmail.com", "merchant");
    const other = await signup("intruder.test@gmail.com", "intruder");
    const created = await owner.agent
      .post("/api/payment-links")
      .send({ amount: 10, description: "Order", customerPhone: "+33 1 23", notes: "private" });
    expect(created.status).toBe(201);
    const token = created.body.link_url.split("/pay/")[1];

    const view = await request(app).get(`/api/payment-links/${token}`);
    expect(view.status).toBe(200);
    expect(view.body.customerPhone).toBeUndefined();
    expect(view.body.notes).toBeUndefined();

    expect((await other.agent.post(`/api/payment-links/${created.body.link_id}/disable`)).status).toBe(404);
    expect((await owner.agent.post(`/api/payment-links/${created.body.link_id}/disable`)).status).toBe(200);
  });

  it("stops a one-time link from being paid twice", async () => {
    const owner = await signup("linkowner.test@gmail.com", "linkowner");
    const created = await owner.agent.post("/api/payment-links").send({ amount: 20, description: "One-off" });
    const token = created.body.link_url.split("/pay/")[1];

    const first = await request(app).post(`/api/payment-links/${token}/pay`).send({ paymentMethod: "crypto", email: "payer.test@gmail.com" });
    expect(first.status).toBe(200);
    const tx = await prisma.linkTransaction.findFirstOrThrow({ where: { paymentLink: { token } } });
    const body = { order_id: tx.gatewayOrderId, status: "paid" };
    await request(app).post("/api/webhooks/cryptomus").send({ ...body, sign: cryptomusSign(body) }).expect(200);

    const second = await request(app).post(`/api/payment-links/${token}/pay`).send({ paymentMethod: "crypto", email: "payer.test@gmail.com" });
    expect(second.status).toBe(400);
  });
});

describe("forms and error handling", () => {
  it("stores support tickets and reviews", async () => {
    const t = await request(app).post("/api/tickets").send({ email: "help.test@gmail.com", reason: "Order", message: "Where is it?" });
    expect(t.status).toBe(201);
    const r = await request(app).post("/api/reviews").send({ page: "buy-youtube-views", name: "A", email: "a.test@gmail.com", rating: 5, text: "Good" });
    expect(r.status).toBe(201);
    expect(await prisma.review.findFirst({ where: { email: "a.test@gmail.com" } })).toMatchObject({ approved: false });
  });

  it("returns 400 for invalid JSON and JSON 404 for unknown API routes", async () => {
    const bad = await request(app).post("/api/auth/login").set("Content-Type", "application/json").send("{bad");
    expect(bad.status).toBe(400);
    const missing = await request(app).get("/api/nope");
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: "Not found" });
  });
});
