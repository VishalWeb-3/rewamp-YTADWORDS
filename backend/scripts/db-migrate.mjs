// Applies migrations/*.sql to the local SQLite file named by DATABASE_URL (dev and tests).
// Production D1 uses `wrangler d1 migrations apply` on the same files.
import Database from "better-sqlite3";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = (process.env.DATABASE_URL ?? "file:./dev.db").replace(/^file:/, "");

const db = new Database(path.resolve(root, file));
db.exec("CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY)");
for (const name of readdirSync(path.join(root, "migrations")).filter((f) => f.endsWith(".sql")).sort()) {
  if (db.prepare("SELECT 1 FROM _migrations WHERE name = ?").get(name)) continue;
  db.exec(readFileSync(path.join(root, "migrations", name), "utf8"));
  db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(name);
  console.log(`applied ${name}`);
}
db.close();
