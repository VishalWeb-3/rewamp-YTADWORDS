/**
 * Builds the package reference the API prices an order from. Prices are never sent:
 * the backend looks them up in its own catalog (backend/lib/catalog.ts).
 */
export function toOrderItem(item, link) {
  return { slug: item.slug, tier: item.tier || 'regular', quantity: String(item.quantity), link };
}

/** Reads a JSON response, turning HTML error pages into a readable error. */
export async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      text.includes('<!DOCTYPE')
        ? 'Could not reach the server. Please try again in a moment.'
        : `Server returned an invalid response (${res.status}).`
    );
  }
}

/** Encodes package references for a shareable /pay link (no prices: the server prices them). */
export function encodeShareItems(items) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(items))));
}

/** Decodes the items parameter of a shared /pay link. Returns [] when it is missing or malformed. */
export function decodeShareItems(param) {
  if (!param) return [];
  try {
    const items = JSON.parse(decodeURIComponent(escape(atob(param))));
    return Array.isArray(items) ? items.filter((item) => item && typeof item.slug === 'string').slice(0, 20) : [];
  } catch {
    return [];
  }
}
