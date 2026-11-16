/**
 * Converts a package quantity label to a number: "5.0K" → 5000, "50k" → 50000, "1.0M" → 1000000.
 * Returns NaN when the label can't be parsed. Mirrors parseQuantity in backend/lib/catalog.ts.
 */
export function parseQuantity(value) {
  if (typeof value === 'number') return value;
  const match = String(value ?? '').trim().replace(/,/g, '').match(/^(\d+(?:\.\d+)?)\s*([kKmM])?$/);
  if (!match) return NaN;
  const multiplier = !match[2] ? 1 : match[2].toLowerCase() === 'k' ? 1000 : 1000000;
  return Math.round(parseFloat(match[1]) * multiplier);
}

/** Formats a quantity for display, e.g. 5000 → "5,000". Falls back to the raw label. */
export function formatQuantity(value) {
  const n = parseQuantity(value);
  return Number.isFinite(n) ? n.toLocaleString('en-US') : String(value ?? '');
}
