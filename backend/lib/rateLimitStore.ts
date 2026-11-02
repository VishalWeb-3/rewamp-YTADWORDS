// Rate limit counts for Workers, where memory isn't shared between requests.
// Each visitor gets one Durable Object per limiter. Import this before app.ts.
import { DurableObject, env } from "cloudflare:workers";
import type { Options, Store } from "express-rate-limit";
import { useRateLimitStore } from "./rateLimit.js";

type Counter = { count: number; resetAt: number };

export class RateLimitCounter extends DurableObject {
  async hit(windowMs: number): Promise<Counter> {
    const now = Date.now();
    const saved = await this.ctx.storage.get<Counter>("counter");
    const counter = saved && saved.resetAt > now ? saved : { count: 0, resetAt: now + windowMs };
    counter.count += 1;
    await this.ctx.storage.put("counter", counter);
    if (counter.count === 1) await this.ctx.storage.setAlarm(counter.resetAt);
    return counter;
  }

  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}

class DurableObjectStore implements Store {
  private windowMs = 0;

  constructor(public prefix: string) {}

  init(options: Options) {
    this.windowMs = options.windowMs;
  }

  async increment(key: string) {
    const counter = env.RATE_LIMITS.get(env.RATE_LIMITS.idFromName(`${this.prefix}:${key}`));
    const { count, resetAt } = await counter.hit(this.windowMs);
    return { totalHits: count, resetTime: new Date(resetAt) };
  }

  // Requests are never un-counted, and nothing resets a visitor early
  async decrement() {}
  async resetKey() {}
}

useRateLimitStore((prefix) => new DurableObjectStore(prefix));
