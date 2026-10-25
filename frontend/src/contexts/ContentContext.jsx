import React, { createContext, useContext, useMemo } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';
import contactContent from '../../content/contact/contact.json';
import pricingContent from '../../content/pricing/index.json';
import pricingPageContent from '../../content/pricing-pages/index.json';
import legalContent from '../../content/legal/index.json';
import googlePricingContent from '../../content/google-pricing/index.json';

// Page metadata (title, description, keywords) edited in Tina lives in the front matter of content/pages/*.mdx
const pageFiles = import.meta.glob('../../content/pages/*.mdx', { query: '?raw', import: 'default', eager: true });

function parseFrontMatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw || '');
  if (!match) return null;
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]] = kv[2].replace(/^(['"])(.*)\1$/, '$2').trim();
  }
  return data;
}

const pageMetadata = Object.fromEntries(
  Object.entries(pageFiles)
    .map(([file, raw]) => {
      const meta = parseFrontMatter(raw);
      const slug = meta?.slug || file.split('/').pop().replace(/\.mdx$/, '');
      return meta ? [slug, meta] : null;
    })
    .filter(Boolean)
);

const ContentContext = createContext(null);

const staticValue = {
  global: globalContent,
  home: homeContent,
  contact: contactContent,
  pricing: pricingContent,
  pricingPageContent,
  legal: legalContent,
  googlePricing: googlePricingContent,
  pageMetadata,
};

export function ContentProvider({ children }) {
  return (
    <ContentContext.Provider value={staticValue}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}

export function useGlobalContent() {
  const { global } = useContent();
  return global;
}

export function useHomeContent() {
  const { home } = useContent();
  return home;
}

export function useContactContent() {
  const { contact } = useContent();
  return contact;
}

export function useLegalContent() {
  const { legal } = useContent();
  return legal;
}

/** Convert Tina pricing package list to package objects with quantityKey. */
function toPackages(list, quantityKey) {
  if (!Array.isArray(list) || !quantityKey) return [];
  return list.map((p) => {
    if (!p) return null;
    const q = p.quantity ?? '';
    return {
      [quantityKey]: q,
      price: p.price ?? '',
      originalPrice: p.originalPrice && String(p.originalPrice).trim() ? p.originalPrice : null,
      discount: p.discount && String(p.discount).trim() ? p.discount : null,
    };
  }).filter(Boolean);
}

/**
 * Get pricing packages for a page by slug, in the shape { regular, fast, ads }.
 * Each tier is an array of { [quantityKey]: string, price, originalPrice, discount }.
 * Returns null if no pricing data for that slug.
 */
export function getPricingPackagesBySlug(pricing, slug) {
  if (!pricing?.pages || !slug) return null;
  const page = pricing.pages.find((p) => p && p.slug === slug);
  if (!page || !page.quantityKey) return null;
  const key = page.quantityKey;
  return {
    regular: toPackages(page.regularPackages, key),
    fast: toPackages(page.fastPackages, key),
    ads: toPackages(page.adsPackages, key),
  };
}

/**
 * Hook: get packages for the current pricing page by slug. Falls back to fallbackPackages if no Tina data.
 */
export function usePricingPackages(slug, fallbackPackages) {
  const { pricing } = useContent();
  return useMemo(() => {
    const fromTina = getPricingPackagesBySlug(pricing, slug);
    if (fromTina && (fromTina.regular?.length || fromTina.fast?.length || fromTina.ads?.length)) {
      return fromTina;
    }
    return fallbackPackages ?? null;
  }, [pricing, slug, fallbackPackages]);
}

/**
 * Get pricing page content (hero, tabs, features, FAQ, etc.) by slug.
 * Returns null if no entry for that slug.
 */
export function getPricingPageContentBySlug(pricingPageContent, slug) {
  if (!pricingPageContent?.pages || !slug) return null;
  return pricingPageContent.pages.find((p) => p && p.slug === slug) ?? null;
}

/**
 * Hook: get editable pricing page content by slug. Falls back to fallback when no Tina data for that slug.
 */
export function usePricingPageContent(slug, fallback) {
  const { pricingPageContent } = useContent();
  return useMemo(() => {
    const fromTina = getPricingPageContentBySlug(pricingPageContent, slug);
    return fromTina ?? fallback ?? null;
  }, [pricingPageContent, slug, fallback]);
}

/**
 * Hook: get page metadata (title, description, keywords) by slug from content/pages/*.mdx.
 * Returns null if no metadata exists for that slug.
 */
export function usePageMetadata(slug) {
  const { pageMetadata: meta } = useContent();
  return (slug && meta[slug]) || null;
}

export function useGooglePricing() {
  const { googlePricing } = useContent();
  return googlePricing;
}

export function getGooglePricingBySlug(googlePricing, slug) {
  if (!googlePricing?.pages || !slug) return null;
  return googlePricing.pages.find((p) => p && p.slug === slug) ?? null;
}
