import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Local SQLite file for dev and tests
export function createAdapter() {
  return new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
}
