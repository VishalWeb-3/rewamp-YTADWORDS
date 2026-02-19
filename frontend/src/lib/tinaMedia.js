/**
 * Resolves an image src from Tina CMS for use in <img src={...} />.
 * - Full URLs (http/https) are returned as-is.
 * - Local paths (e.g. from Tina media upload to public/uploads) are returned
 *   as root-relative paths (e.g. /uploads/foo.png) so they resolve correctly.
 * @param {string} [src] - Image path or URL from Tina (can be undefined).
 * @returns {string} Resolved src, or empty string if no src.
 */
export function resolveImageSrc(src) {
  if (!src || typeof src !== 'string') return '';
  const trimmed = src.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return path;
}
