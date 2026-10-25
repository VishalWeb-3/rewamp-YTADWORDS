// Copies the TinaCMS pricing JSON into backend/data so the API can price orders
// even when deployed without the frontend folder. Safe to run when frontend/ is absent.
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.resolve(backendRoot, "..", "frontend", "content");
const dataDir = path.resolve(backendRoot, "data");

mkdirSync(dataDir, { recursive: true });
for (const name of ["pricing", "google-pricing"]) {
  const src = path.join(contentDir, name, "index.json");
  if (existsSync(src)) {
    copyFileSync(src, path.join(dataDir, `${name}.json`));
    console.log(`Synced ${name}.json`);
  } else {
    console.log(`Skipped ${name}: ${src} not found, keeping existing copy`);
  }
}
