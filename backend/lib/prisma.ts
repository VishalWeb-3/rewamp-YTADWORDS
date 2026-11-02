import { PrismaClient } from "#prisma-client";
import { createAdapter } from "#db-adapter";

// D1 is a binding, not a connection, so one client per process or isolate is enough
let client: PrismaClient | undefined;

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    client ??= new PrismaClient({ adapter: createAdapter() });
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export { prisma };
