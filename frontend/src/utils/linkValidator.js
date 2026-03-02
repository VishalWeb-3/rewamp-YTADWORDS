/**
 * Validates links based on the platform to ensure they are "authentic"
 * @param {string} link - The link or username to validate
 * @param {string} platform - The platform name (YouTube, TikTok, Google, etc.)
 * @returns {boolean} - True if the link is valid for the platform
 */
export const isValidLink = (link, platform) => {
    if (!link) return false;
    const v = link.trim();
    const p = (platform || '').toLowerCase();

    // YouTube validations
    if (p.includes('youtube')) {
        // Stricter YouTube regex based on specific path patterns and youtu.be/VIDEOID
        // Handles parameters like &t=, &feature= etc.
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|channel\/|@|c\/|user\/|shorts\/)|youtu\.be\/)[\w\-\._\?\&\%#\=\+]+$/i;
        // Also allow just the channel handle for search/suggestions
        const isHandle = /^@[\w.-]+$/.test(v);
        return youtubeRegex.test(v) || isHandle;
    }

    // TikTok validations
    if (p.includes('tiktok')) {
        // Anchored to the end to prevent extra garbage paths
        const tiktokUrlRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/@[\w.-]+(\/video\/\d+)?\/?$/i;
        // Matches @username
        const tiktokHandleRegex = /^@[\w.-]+$/;
        return tiktokUrlRegex.test(v) || tiktokHandleRegex.test(v);
    }

    // Google validations (Maps/Business)
    if (p.includes('google')) {
        // Includes Maps, goo.gl short links, g.page, and general search links for businesses
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
        // Matches profile pages, pages, watch videos
        const fbRegex = /^(https?:\/\/)?(www\.|m\.|web\.)?(facebook\.com|fb\.watch)\/.+$/i;
        return fbRegex.test(v);
    }

    // Twitter / X validations
    if (p.includes('twitter') || p.includes(' x ')) {
        const xRegex = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[\w.-]+\/?$/i;
        const xHandleRegex = /^@[\w.-]+$/;
        return xRegex.test(v) || xHandleRegex.test(v);
    }

    // Generic URL validation - requiring https? protocol for strictness as suggested
    const genericUrlRegex = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\- .\/?%&=]*)?$/i;
    return genericUrlRegex.test(v);
};

/**
 * Gets a helpful placeholder or error message for a platform's link field
 * @param {string} platform 
 * @returns {string}
 */
export const getLinkPlaceholder = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('youtube')) return 'Paste YouTube video link or @channel...';
    if (p.includes('tiktok')) return 'Paste TikTok URL or @username...';
    if (p.includes('google')) return 'Paste Google Maps link or business URL...';
    if (p.includes('instagram')) return 'Paste Instagram profile URL or @username...';
    return 'Paste your link here (e.g. https://example.com/...)';
};
