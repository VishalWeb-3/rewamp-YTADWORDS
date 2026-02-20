import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({
  title = 'YoutubeADwords - Boost Your Google Ads & TikTok Campaigns',
  description = 'Experience rapid growth with YoutubeADwords premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide.',
  keywords = '',
  ogImage = '/favicon.svg',
  ogType = 'website',
}) {
  const location = useLocation();
  const canonicalUrl = typeof window !== 'undefined' ? window.location.origin + location.pathname : '';

  useEffect(() => {
    const head = document.head;
    const fullTitle = title.includes('YoutubeADwords') ? title : `${title} | YoutubeADwords`;

    const upsertMetaByName = (name, content) => {
      if (!name || content == null) return;
      let el = head.querySelector(`meta[name="${CSS.escape(name)}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        head.appendChild(el);
      }
      el.setAttribute('content', String(content));
    };

    const upsertMetaByProp = (property, content) => {
      if (!property || content == null) return;
      let el = head.querySelector(`meta[property="${CSS.escape(property)}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        head.appendChild(el);
      }
      el.setAttribute('content', String(content));
    };

    const upsertLink = (rel, href) => {
      if (!rel || !href) return;
      let el = head.querySelector(`link[rel="${CSS.escape(rel)}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        head.appendChild(el);
      }
      el.setAttribute('href', String(href));
    };

    // Set document title
    document.title = fullTitle;

    // Basic meta tags
    upsertMetaByName('title', fullTitle);
    upsertMetaByName('description', description);
    if (keywords) upsertMetaByName('keywords', keywords);

    // Open Graph tags
    upsertMetaByProp('og:type', ogType);
    upsertMetaByProp('og:title', fullTitle);
    upsertMetaByProp('og:description', description);
    const ogImageUrl = typeof ogImage === 'string' ? ogImage : (ogImage?.src || '/favicon.svg');
    upsertMetaByProp('og:image', ogImageUrl);
    upsertMetaByProp('og:url', canonicalUrl);

    // Twitter tags
    upsertMetaByName('twitter:card', 'summary_large_image');
    upsertMetaByName('twitter:title', fullTitle);
    upsertMetaByName('twitter:description', description);
    upsertMetaByName('twitter:image', ogImageUrl);
    upsertMetaByName('twitter:url', canonicalUrl);

    // Canonical URL
    if (canonicalUrl) upsertLink('canonical', canonicalUrl);
  }, [title, description, keywords, ogImage, ogType, canonicalUrl]);

  return null;
}
