const normalize = (str) => (str || '').trim().toLowerCase();

/**
 * Validates links based on the platform to ensure they are "authentic"
 * @param {string} link - The link or username to validate
 * @param {string} platform - The platform name (YouTube, TikTok, Google, etc.)
 * @returns {boolean} - True if the link is valid for the platform
 */
export const isValidLink = (link, platform) => {
    if (!link) return false;
    const v = link.trim();
    const p = normalize(platform);

    // YouTube validations
    if (p.includes('youtube')) {
        // Stricter YouTube regex: match specific paths (watch, channel, @, c, user, shorts) or youtu.be
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|channel\/|@|c\/|user\/|shorts\/)|youtu\.be\/)[\w\-\._\?\&\%#\=\+]+$/i;
        // Also allow just the channel handle
        const isHandle = /^@[\w.-]+$/.test(v);
        return youtubeRegex.test(v) || isHandle;
    }

    // TikTok validations
    if (p.includes('tiktok')) {
        // Anchored to end, allows profile or specific video
        const tiktokUrlRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[\w.-]+(\/video\/\d+)?\/?$/i;
        // Matches @username
        const tiktokHandleRegex = /^@[\w.-]+$/;
        return tiktokUrlRegex.test(v) || tiktokHandleRegex.test(v);
    }

    // Google validations (Maps/Business)
    if (p.includes('google')) {
        // Matches google.com/maps, goo.gl/maps, maps.app.goo.gl, plus g.page and business search links
        const googleRegex = /^(https?:\/\/)?(www\.|maps\.)?(google\.com\/(maps|search\?q=)|goo\.gl\/maps|maps\.app\.goo\.gl|g\.page)\/.+$/i;
        return googleRegex.test(v);
    }

    // Instagram validations
    if (p.includes('instagram')) {
        const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/[\w._-]+\/?$/i;
        const instagramHandleRegex = /^@[\w._-]+$/;
        return instagramRegex.test(v) || instagramHandleRegex.test(v);
    }

    // Facebook / Meta validations
    if (p.includes('facebook') || p.includes('meta')) {
        const fbRegex = /^(https?:\/\/)?(www\.|m\.|web\.)?(facebook\.com|fb\.watch)\/.+$/i;
        return fbRegex.test(v);
    }

    // Twitter / X validations
    if (p.includes('twitter') || p.includes(' x ') || p === 'x') {
        const xRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[\w.-]+\/?$/i;
        const xHandleRegex = /^@[\w.-]+$/;
        return xRegex.test(v) || xHandleRegex.test(v);
    }

    // Generic URL validation - require protocol for generic domains
    const genericUrlRegex = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- .\/?%&=]*)?$/i;
    return genericUrlRegex.test(v);
};

/**
 * Gets a helpful placeholder for a platform's link field
 * @param {string} platform 
 * @returns {string}
 */
export const getLinkPlaceholder = (platform) => {
    const p = normalize(platform);
    if (p.includes('youtube')) return 'Paste YouTube video link or @channel...';
    if (p.includes('tiktok')) return 'Paste TikTok URL or @username...';
    if (p.includes('google')) return 'Paste Google Maps link or business URL...';
    if (p.includes('instagram')) return 'Paste Instagram profile URL or @username...';
    if (p.includes('facebook') || p.includes('meta')) return 'Paste Facebook page or video URL...';
    return 'Paste your link here (e.g. https://example.com/...)';
};
