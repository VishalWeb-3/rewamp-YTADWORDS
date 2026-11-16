// Prisma config - the local SQLite file is only used for Node dev and tests; production is Cloudflare D1
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"] ?? "file:./dev.db",
  },
});
