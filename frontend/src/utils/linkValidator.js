const normalize = (str) => (str || '').trim().toLowerCase();

// Accepted hostnames per platform (subdomains such as www., m., vm. are allowed)
const PLATFORM_HOSTS = {
  youtube: ['youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com'],
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.watch', 'fb.com'],
  twitter: ['twitter.com', 'x.com'],
};

const HANDLE_PLATFORMS = ['youtube', 'tiktok', 'instagram', 'twitter'];

function platformKey(platform) {
  const p = normalize(platform);
  if (p.includes('youtube')) return 'youtube';
  if (p.includes('tiktok')) return 'tiktok';
  if (p.includes('google')) return 'google';
  if (p.includes('instagram')) return 'instagram';
  if (p.includes('facebook') || p.includes('meta')) return 'facebook';
  if (p.includes('twitter') || p === 'x') return 'twitter';
  return 'other';
}

function parseUrl(value) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.includes('.') ? url : null;
  } catch {
    return null;
  }
}

const hostMatches = (hostname, allowed) =>
  allowed.some((h) => hostname === h || hostname.endsWith(`.${h}`));

// Google Maps / Business links: google.<any TLD>/maps, maps.google.*, goo.gl/maps,
// maps.app.goo.gl, g.page, g.co/kgs and Google search results for a business
function isGoogleBusinessUrl(url) {
  const host = url.hostname.replace(/^www\./, '');
  const path = url.pathname;
  if (host === 'maps.app.goo.gl' || host === 'g.page' || host === 'g.co') return path.length > 1;
  if (host === 'goo.gl') return path.startsWith('/maps');
  if (/^(maps\.)?google\.[a-z.]{2,6}$/.test(host)) {
    return host.startsWith('maps.') || path.startsWith('/maps') || (path.startsWith('/search') && url.searchParams.has('q'));
  }
  return false;
}

/**
 * Checks that a link or @handle belongs to the given platform.
 * @param {string} link - The link or username to validate
 * @param {string} platform - The platform name (YouTube, TikTok, Google, etc.)
 * @returns {boolean} - True if the link is valid for the platform
 */
export const isValidLink = (link, platform) => {
  if (!link) return false;
  const v = link.trim();
  if (!v || /\s/.test(v)) return false;
  const key = platformKey(platform);

  if (HANDLE_PLATFORMS.includes(key) && /^@[\w.-]+$/.test(v)) return true;

  const url = parseUrl(v);
  if (!url) return false;

  if (key === 'google') return isGoogleBusinessUrl(url);
  if (PLATFORM_HOSTS[key]) {
    return hostMatches(url.hostname.toLowerCase(), PLATFORM_HOSTS[key]) && (url.pathname.length > 1 || url.search.length > 1);
  }
  // Generic links must spell out the protocol
  return /^https?:\/\//i.test(v);
};

/**
 * Gets a helpful placeholder for a platform's link field
 * @param {string} platform
 * @returns {string}
 */
export const getLinkPlaceholder = (platform) => {
  const key = platformKey(platform);
  if (key === 'youtube') return 'Paste YouTube video link or @channel...';
  if (key === 'tiktok') return 'Paste TikTok URL or @username...';
  if (key === 'google') return 'Paste Google Maps link or business URL...';
  if (key === 'instagram') return 'Paste Instagram profile URL or @username...';
  if (key === 'facebook') return 'Paste Facebook page or video URL...';
  return 'Paste your link here (e.g. https://example.com/...)';
};
