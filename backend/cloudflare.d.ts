// The parts of the Cloudflare runtime that worker.ts and lib/rateLimitStore.ts use
declare module "cloudflare:node" {
  export function httpServerHandler(options: { port: number }): unknown;
}

declare module "cloudflare:workers" {
  export const env: {
    DB: ConstructorParameters<typeof import("@prisma/adapter-d1").PrismaD1>[0];
    RATE_LIMITS: {
      idFromName(name: string): unknown;
      get(id: unknown): { hit(windowMs: number): Promise<{ count: number; resetAt: number }> };
    };
  };
  export function waitUntil(promise: Promise<unknown>): void;
  export class DurableObject {
    protected ctx: {
      storage: {
        get<T>(key: string): Promise<T | undefined>;
        put(key: string, value: unknown): Promise<void>;
        setAlarm(time: number): Promise<void>;
        deleteAll(): Promise<void>;
      };
    };
  }
}
