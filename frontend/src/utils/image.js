/**
 * Resolve Tina image field to a URL string.
 * Tina can store: string path (e.g. "uploads/photo.jpg") or object { src: "..." }.
 * Returns a path suitable for <img src=""> (leading slash for absolute from public).
 */
export function resolveImageUrl(value, fallback = '') {
  if (!value) return fallback;
  const path = typeof value === 'string' ? value : value?.src;
  if (!path) return fallback;
  return path.startsWith('/') ? path : `/${path}`;
}
