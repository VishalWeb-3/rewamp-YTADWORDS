import type { Request } from "express";
import rateLimit, { ipKeyGenerator, type Store } from "express-rate-limit";

/** The visitor's IP. Cloudflare sets this header and overwrites any value the client sends. */
export const clientIp = (req: Request) => String(req.headers["cf-connecting-ip"] || req.ip || "");

let storeFactory: ((prefix: string) => Store) | undefined;

/** Must run before app.ts loads, because the limiters are created at import time. */
export const useRateLimitStore = (factory: (prefix: string) => Store) => {
  storeFactory = factory;
};

export const limiter = (limit: number, windowMinutes = 15) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === "test",
    keyGenerator: (req) => ipKeyGenerator(clientIp(req), 56),
    store: storeFactory?.(`${limit}-${windowMinutes}`),
    passOnStoreError: true, // a counter outage shouldn't lock everyone out of login and checkout
    validate: false,
    message: { error: "Too many requests, please try again later." },
  });
