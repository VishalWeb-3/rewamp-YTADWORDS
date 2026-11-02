import { PrismaD1 } from "@prisma/adapter-d1";
import { env } from "cloudflare:workers";

export function createAdapter() {
  return new PrismaD1(env.DB);
}
