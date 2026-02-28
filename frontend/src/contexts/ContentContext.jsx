import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';
import contactContent from '../../content/contact/contact.json';
import pricingContent from '../../content/pricing/index.json';
import pricingPageContent from '../../content/pricing-pages/index.json';
import legalContent from '../../content/legal/index.json';
import googlePricingContent from '../../content/google-pricing/index.json';

// Fetch latest from Tina Cloud at runtime so edits in Tina appear without rebuild

function omitSys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const { _sys, id, __typename, ...rest } = obj;
  return Object.fromEntries(
    Object.entries(rest).map(([k, v]) => [
      k,
      Array.isArray(v) ? v.map(omitSys) : typeof v === 'object' && v !== null ? omitSys(v) : v,
    ])
  );
}

const ContentContext = createContext(null);

const staticValue = {
  global: globalContent,
  home: homeContent,
  contact: contactContent,
  pricing: pricingContent,
  pricingPageContent,
  legal: legalContent,
  googlePricing: googlePricingContent,
  pageMetadata: {},
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
 * Hook: get page metadata (title, description) by slug from TinaCMS.
 * Returns null if no metadata found for that slug.
 */
export function usePageMetadata(slug) {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!slug) {
      setMetadata(null);
      return;
    }

    let cancelled = false;
    const fetchMetadata = async () => {
      try {
        // Try to fetch from Tina Cloud
        if (typeof client.queries.pageMetadata === 'function') {
          const result = await client.queries.pageMetadata({ relativePath: `${slug}.mdx` });
          if (!cancelled && result?.data?.pageMetadata) {
            const meta = omitSys(result.data.pageMetadata);
            // Convert ogImage object to URL string if needed
            if (meta.ogImage && typeof meta.ogImage === 'object' && meta.ogImage.src) {
              meta.ogImage = meta.ogImage.src;
            }
            setMetadata(meta);
            return;
          }
        }
      } catch (err) {
        // If not found in Tina, metadata stays null
        console.debug(`No metadata found for slug: ${slug}`);
      }
    };

    fetchMetadata();
    return () => { cancelled = true; };
  }, [slug]);

  return metadata;
}

export function useGooglePricing() {
  const { googlePricing } = useContent();
  return googlePricing;
}

export function getGooglePricingBySlug(googlePricing, slug) {
  if (!googlePricing?.pages || !slug) return null;
  return googlePricing.pages.find((p) => p && p.slug === slug) ?? null;
}
