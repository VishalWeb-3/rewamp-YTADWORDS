import { execFileSync } from "child_process";
import { rmSync } from "fs";

// A fresh SQLite file per run, built from the same migrations D1 uses
export default function setup() {
  rmSync("tests/.test.db", { force: true });
  execFileSync("node", ["scripts/db-migrate.mjs"], { env: { ...process.env, DATABASE_URL: "file:./tests/.test.db" }, stdio: "inherit" });
}
