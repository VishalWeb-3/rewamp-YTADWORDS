import express from "express";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "./prisma.js";
import { limiter } from "./rateLimit.js";

// Admin API for the actions the old admin service performed: bans, review moderation,
// order status, tickets and CTA switches. Callers send `Authorization: Bearer <ADMIN_API_KEY>`.
export const adminRouter = express.Router();

const ORDER_STATUSES = ["PENDING", "PROGRESS", "COMPLETED", "CANCELED"] as const;

function hasValidKey(header: string | undefined) {
  const key = process.env.ADMIN_API_KEY;
  if (!key || !header?.startsWith("Bearer ")) return false;
  // Hash both sides so the comparison is constant-time whatever the lengths
  const digest = (v: string) => crypto.createHash("sha256").update(v).digest();
  return crypto.timingSafeEqual(digest(header.slice(7)), digest(key));
}

adminRouter.use(limiter(120));
adminRouter.use((req, res, next) => {
  if (!process.env.ADMIN_API_KEY) return res.status(503).json({ error: "Admin API is not configured" });
  if (!hasValidKey(req.headers.authorization)) return res.status(401).json({ error: "Invalid admin key" });
  next();
});

const idParam = z.coerce.number().int().positive();
const pageQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
const bool = z.enum(["true", "false"]).transform((v) => v === "true");

const bad = (res: express.Response, error: z.ZodError) =>
  res.status(400).json({ error: "Invalid request", details: error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) });

const userSelect = {
  id: true,
  email: true,
  username: true,
  name: true,
  isGuest: true,
  isBanned: true,
  bannedAt: true,
  banReason: true,
  createdAt: true,
} as const;

// ========== Users ==========
adminRouter.get("/users", async (req, res) => {
  const q = pageQuery.extend({ search: z.string().trim().max(100).optional(), banned: bool.optional() }).safeParse(req.query);
  if (!q.success) return bad(res, q.error);
  const { page, pageSize, search, banned } = q.data;
  const where = {
    ...(banned !== undefined && { isBanned: banned }),
    ...(search && { OR: [{ email: { contains: search } }, { username: { contains: search } }, { name: { contains: search } }] }),
  };
  const [items, total] = await Promise.all([
    prisma.user.findMany({ where, select: userSelect, orderBy: { id: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.user.count({ where }),
  ]);
  res.json({ items, total, page, pageSize });
});

adminRouter.get("/users/:id", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return bad(res, id.error);
  const user = await prisma.user.findUnique({
    where: { id: id.data },
    select: { ...userSelect, _count: { select: { orders: true, tickets: true } }, ctaActions: { select: { actionKey: true, isActive: true } } },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

adminRouter.post("/users/:id/ban", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  const body = z.object({ reason: z.string().trim().max(500).optional() }).safeParse(req.body ?? {});
  if (!id.success) return bad(res, id.error);
  if (!body.success) return bad(res, body.error);
  const { count } = await prisma.user.updateMany({
    where: { id: id.data },
    data: { isBanned: true, bannedAt: new Date(), banReason: body.data.reason || null },
  });
  if (!count) return res.status(404).json({ error: "User not found" });
  // Ending their sessions logs them out everywhere straight away
  await prisma.session.deleteMany({ where: { userId: id.data } });
  res.json({ message: "User banned" });
});

adminRouter.post("/users/:id/unban", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return bad(res, id.error);
  const { count } = await prisma.user.updateMany({
    where: { id: id.data },
    data: { isBanned: false, bannedAt: null, banReason: null },
  });
  if (!count) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User unbanned" });
});

// ========== Orders ==========
adminRouter.get("/orders", async (req, res) => {
  const q = pageQuery
    .extend({ status: z.enum(ORDER_STATUSES).optional(), userId: idParam.optional(), externalOrderId: z.string().max(100).optional() })
    .safeParse(req.query);
  if (!q.success) return bad(res, q.error);
  const { page, pageSize, status, userId, externalOrderId } = q.data;
  const where = { ...(status && { status }), ...(userId && { userId }), ...(externalOrderId && { externalOrderId }) };
  const [items, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.order.count({ where }),
  ]);
  res.json({ items, total, page, pageSize });
});

adminRouter.get("/orders/:id", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return bad(res, id.error);
  const order = await prisma.order.findUnique({ where: { id: id.data }, include: { user: { select: userSelect } } });
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

adminRouter.patch("/orders/:id", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  const body = z.object({ status: z.enum(ORDER_STATUSES) }).safeParse(req.body);
  if (!id.success) return bad(res, id.error);
  if (!body.success) return bad(res, body.error);
  const { count } = await prisma.order.updateMany({ where: { id: id.data }, data: { status: body.data.status } });
  if (!count) return res.status(404).json({ error: "Order not found" });
  res.json({ message: "Order updated", status: body.data.status });
});

// ========== Reviews ==========
adminRouter.get("/reviews", async (req, res) => {
  const q = pageQuery.extend({ approved: bool.optional() }).safeParse(req.query);
  if (!q.success) return bad(res, q.error);
  const { page, pageSize, approved } = q.data;
  const where = approved === undefined ? {} : { approved };
  const [items, total] = await Promise.all([
    prisma.review.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.review.count({ where }),
  ]);
  res.json({ items, total, page, pageSize });
});

adminRouter.post("/reviews/:id/approve", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return bad(res, id.error);
  const { count } = await prisma.review.updateMany({ where: { id: id.data }, data: { approved: true } });
  if (!count) return res.status(404).json({ error: "Review not found" });
  res.json({ message: "Review approved" });
});

adminRouter.delete("/reviews/:id", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  if (!id.success) return bad(res, id.error);
  const { count } = await prisma.review.deleteMany({ where: { id: id.data } });
  if (!count) return res.status(404).json({ error: "Review not found" });
  res.json({ message: "Review deleted" });
});

// ========== Tickets ==========
adminRouter.get("/tickets", async (req, res) => {
  const q = pageQuery.extend({ status: z.enum(["OPEN", "CLOSED"]).optional() }).safeParse(req.query);
  if (!q.success) return bad(res, q.error);
  const { page, pageSize, status } = q.data;
  const where = status ? { status } : {};
  const [items, total] = await Promise.all([
    prisma.ticket.findMany({ where, orderBy: { id: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.ticket.count({ where }),
  ]);
  res.json({ items, total, page, pageSize });
});

adminRouter.patch("/tickets/:id", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  const body = z.object({ status: z.enum(["OPEN", "CLOSED"]) }).safeParse(req.body);
  if (!id.success) return bad(res, id.error);
  if (!body.success) return bad(res, body.error);
  const { count } = await prisma.ticket.updateMany({ where: { id: id.data }, data: { status: body.data.status } });
  if (!count) return res.status(404).json({ error: "Ticket not found" });
  res.json({ message: "Ticket updated", status: body.data.status });
});

// ========== CTA switches (global, and per-user overrides) ==========
const actionKey = z.string().trim().min(1).max(50).regex(/^[a-z0-9_]+$/);

adminRouter.get("/cta-actions", async (_req, res) => {
  res.json(await prisma.ctaAction.findMany({ orderBy: { actionKey: "asc" } }));
});

adminRouter.put("/cta-actions/:key", async (req, res) => {
  const key = actionKey.safeParse(req.params.key);
  const body = z.object({ label: z.string().trim().min(1).max(100).optional(), isActive: z.boolean() }).safeParse(req.body);
  if (!key.success) return bad(res, key.error);
  if (!body.success) return bad(res, body.error);
  const action = await prisma.ctaAction.upsert({
    where: { actionKey: key.data },
    create: { actionKey: key.data, label: body.data.label ?? key.data, isActive: body.data.isActive },
    update: { isActive: body.data.isActive, ...(body.data.label && { label: body.data.label }) },
  });
  res.json(action);
});

adminRouter.put("/users/:id/cta-actions/:key", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  const key = actionKey.safeParse(req.params.key);
  const body = z.object({ isActive: z.boolean() }).safeParse(req.body);
  if (!id.success) return bad(res, id.error);
  if (!key.success) return bad(res, key.error);
  if (!body.success) return bad(res, body.error);
  if (!(await prisma.user.findUnique({ where: { id: id.data }, select: { id: true } }))) {
    return res.status(404).json({ error: "User not found" });
  }
  const override = await prisma.userCtaAction.upsert({
    where: { userId_actionKey: { userId: id.data, actionKey: key.data } },
    create: { userId: id.data, actionKey: key.data, isActive: body.data.isActive },
    update: { isActive: body.data.isActive },
  });
  res.json(override);
});

adminRouter.delete("/users/:id/cta-actions/:key", async (req, res) => {
  const id = idParam.safeParse(req.params.id);
  const key = actionKey.safeParse(req.params.key);
  if (!id.success) return bad(res, id.error);
  if (!key.success) return bad(res, key.error);
  await prisma.userCtaAction.deleteMany({ where: { userId: id.data, actionKey: key.data } });
  res.json({ message: "Override removed" });
});
