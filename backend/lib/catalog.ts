// Server-side price catalog. Prices are read from the same JSON files TinaCMS edits
// (frontend/content/pricing and frontend/content/google-pricing). A copy lives in
// backend/data so the API still works when deployed without the frontend folder;
// `npm run sync-catalog` refreshes that copy.
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

type Package = { quantity?: string | number; price?: string | number };
type PricingPage = {
  slug: string;
  quantityKey?: string;
  regularPackages?: Package[];
  fastPackages?: Package[];
  adsPackages?: Package[];
};
type ReviewPackage = { reviews: number; currentPrice?: number; finalPrice: number };
type ReviewSection = { basic?: ReviewPackage[]; custom?: ReviewPackage[] };
type GooglePricingPage = { slug: string; oneTime?: ReviewSection; monthly?: ReviewSection; drip90?: ReviewSection };

export class PricingError extends Error {}

function loadJson<T>(name: string): T {
  const candidates = [
    path.resolve(backendRoot, "..", "frontend", "content", name, "index.json"),
    path.resolve(backendRoot, "data", `${name}.json`),
  ];
  for (const file of candidates) {
    if (existsSync(file)) return JSON.parse(readFileSync(file, "utf8")) as T;
  }
  throw new Error(`Pricing data "${name}" not found. Run "npm run sync-catalog" in backend/.`);
}

const pricingPages = loadJson<{ pages: PricingPage[] }>("pricing").pages;
const googlePricingPages = loadJson<{ pages: GooglePricingPage[] }>("google-pricing").pages;

const SERVICE_NAMES: Record<string, string> = {
  "buy-youtube-views": "YouTube Views",
  "buy-youtube-subscribers": "YouTube Subscribers",
  "buy-youtube-likes": "YouTube Likes",
  "buy-youtube-watch-hours": "YouTube Watch Hours",
  "buy-tiktok-followers": "TikTok Followers",
  "buy-tiktok-likes": "TikTok Likes",
  "buy-tiktok-views": "TikTok Views",
  "buy-google-skip-ads-views": "Google Skip Ads Views",
  "buy-google-display-ads-views": "Google Display Ads Views",
  "buy-google-apps-download": "Google Apps Download",
  "buy-google-ads-website-traffic": "Google Ads Website Traffic",
  "buy-female-google-reviews": "Female Google Reviews",
  "buy-male-google-reviews": "Male Google Reviews",
  "buy-google-local-guide-reviews": "Google Local Guide Reviews",
  "buy-google-reviews-by-age-group": "Google Reviews by Age Group",
};

const TIER_KEYS = { regular: "regularPackages", fast: "fastPackages", ads: "adsPackages" } as const;

const PAYMENT_TYPE_KEYS: Record<string, keyof Omit<GooglePricingPage, "slug">> = {
  "one-time": "oneTime",
  oneTime: "oneTime",
  recurring: "monthly",
  monthly: "monthly",
  drip: "drip90",
  drip90: "drip90",
};

// Add-on surcharges, as a share of the base package price
const REVIEW_ADD_ONS = { verifiedReviewers: 0.4, ageGroupTargeting: 0.3, genderTargeting: 0.3 } as const;

/** "5.0K" → 5000, "50k" → 50000, "1.5M" → 1500000, "100" → 100. NaN when unparseable. */
export function parseQuantity(value: unknown): number {
  if (typeof value === "number") return value;
  const match = String(value ?? "").trim().replace(/,/g, "").match(/^(\d+(?:\.\d+)?)\s*([kKmM])?$/);
  if (!match) return NaN;
  const multiplier = !match[2] ? 1 : match[2].toLowerCase() === "k" ? 1_000 : 1_000_000;
  return Math.round(parseFloat(match[1]) * multiplier);
}

function platformForSlug(slug: string): string {
  if (slug.includes("youtube")) return "YouTube";
  if (slug.includes("tiktok")) return "TikTok";
  if (slug.includes("review")) return "Google Reviews";
  return "Google";
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export type CatalogItem =
  | { kind?: "package"; slug: string; tier?: string; quantity: string | number }
  | {
      kind: "google-reviews";
      slug: string;
      paymentType: string;
      reviewType: string;
      reviews: number;
      addOns?: Partial<Record<keyof typeof REVIEW_ADD_ONS, boolean>>;
    };

export type PricedItem = { platform: string; service: string; amount: number; price: number };

export function priceItem(item: CatalogItem): PricedItem {
  const serviceName = SERVICE_NAMES[item.slug];
  if (!serviceName) throw new PricingError(`Unknown service "${item.slug}"`);

  if (item.kind === "google-reviews") {
    const page = googlePricingPages.find((p) => p.slug === item.slug);
    const sectionKey = PAYMENT_TYPE_KEYS[item.paymentType];
    const section = page && sectionKey ? page[sectionKey] : undefined;
    const list = item.reviewType === "custom" ? section?.custom : section?.basic;
    const pkg = list?.find((p) => p.reviews === Number(item.reviews));
    if (!pkg) throw new PricingError(`No ${serviceName} package with ${item.reviews} reviews`);

    let price = pkg.finalPrice;
    for (const [key, rate] of Object.entries(REVIEW_ADD_ONS)) {
      if (item.addOns?.[key as keyof typeof REVIEW_ADD_ONS]) price += pkg.finalPrice * rate;
    }
    return {
      platform: "Google Reviews",
      service: `${serviceName} - ${pkg.reviews}`,
      amount: pkg.reviews,
      price: round2(price),
    };
  }

  const page = pricingPages.find((p) => p.slug === item.slug);
  const tier = (item.tier ?? "regular") as keyof typeof TIER_KEYS;
  const tierKey = TIER_KEYS[tier];
  if (!page || !tierKey) throw new PricingError(`Unknown package tier "${item.tier}" for ${serviceName}`);

  const wanted = parseQuantity(item.quantity);
  const pkg = (page[tierKey] ?? []).find((p) => parseQuantity(p.quantity) === wanted);
  const price = pkg ? parseFloat(String(pkg.price)) : NaN;
  if (!pkg || !Number.isFinite(wanted) || !Number.isFinite(price)) {
    throw new PricingError(`No ${serviceName} package for quantity "${item.quantity}"`);
  }
  return {
    platform: platformForSlug(item.slug),
    service: `${serviceName} - ${pkg.quantity}`,
    amount: wanted,
    price: round2(price),
  };
}
