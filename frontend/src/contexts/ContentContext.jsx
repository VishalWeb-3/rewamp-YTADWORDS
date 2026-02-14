import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';
import contactContent from '../../content/contact/contact.json';
import pricingContent from '../../content/pricing/index.json';

// Fetch latest from Tina Cloud at runtime so edits in Tina appear without rebuild
import { client } from '../../tina/__generated__/client';

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
};

export function ContentProvider({ children }) {
  const [value, setValue] = useState(staticValue);

  useEffect(() => {
    let cancelled = false;
    const fetchFromTina = async () => {
      try {
        const promises = [
          client.queries.global({ relativePath: 'index.json' }),
          client.queries.home({ relativePath: 'home.json' }),
        ];
        if (typeof client.queries.contact === 'function') {
          promises.push(client.queries.contact({ relativePath: 'contact.json' }));
        }
        if (typeof client.queries.pricing === 'function') {
          promises.push(client.queries.pricing({ relativePath: 'index.json' }));
        }
        const results = await Promise.all(promises);
        if (cancelled) return;
        const globalData = results[0]?.data?.global;
        const homeData = results[1]?.data?.home;
        const contactData = results[2]?.data?.contact;
        const pricingData = results[3]?.data?.pricing;
        if (globalData || homeData || contactData || pricingData) {
          setValue((prev) => ({
            ...prev,
            ...(globalData && { global: omitSys(globalData) }),
            ...(homeData && { home: omitSys(homeData) }),
            ...(contactData && { contact: omitSys(contactData) }),
            ...(pricingData && { pricing: omitSys(pricingData) }),
          }));
        }
      } catch (_) {
        // Keep static content on error (e.g. branch not indexed, network, CORS)
      }
    };
    fetchFromTina();
    return () => { cancelled = true; };
  }, []);

  return (
    <ContentContext.Provider value={value}>
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
