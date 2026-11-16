// Server-side price catalog. Prices are bundled from the same JSON files TinaCMS edits,
// so the API always ships with the prices the frontend shows.
import pricingData from "../../frontend/content/pricing/index.json" with { type: "json" };

type Package = { quantity?: string | number; price?: string | number };
type PricingPage = {
  slug: string;
  quantityKey?: string;
  regularPackages?: Package[];
  fastPackages?: Package[];
  adsPackages?: Package[];
};

export class PricingError extends Error {}

const pricingPages = (pricingData as { pages: PricingPage[] }).pages;

const SERVICE_NAMES: Record<string, string> = {
  "buy-youtube-views": "YouTube Views",
  "buy-youtube-subscribers": "YouTube Subscribers",
  "buy-youtube-likes": "YouTube Likes",
  "buy-youtube-watch-hours": "YouTube Watch Hours",
  "buy-google-skip-ads-views": "Google Skip Ads Views",
  "buy-google-display-ads-views": "Google Display Ads Views",
  "buy-google-apps-download": "Google Apps Download",
  "buy-google-ads-website-traffic": "Google Ads Website Traffic",
};

const TIER_KEYS = { regular: "regularPackages", fast: "fastPackages", ads: "adsPackages" } as const;

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
  return "Google";
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export type CatalogItem = { kind?: "package"; slug: string; tier?: string; quantity: string | number };

export type PricedItem = { platform: string; service: string; amount: number; price: number };

export function priceItem(item: CatalogItem): PricedItem {
  const serviceName = SERVICE_NAMES[item.slug];
  if (!serviceName) throw new PricingError(`Unknown service "${item.slug}"`);

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
