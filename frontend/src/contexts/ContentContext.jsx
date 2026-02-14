import React, { createContext, useContext, useState, useEffect } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';
import contactContent from '../../content/contact/contact.json';
import pricesContent from '../../content/prices/prices.json';

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

function buildPricesWithPages(prices) {
  const entries = prices?.pageEntries ?? [];
  const pages = entries.reduce((acc, e) => {
    if (e?.slug) acc[e.slug] = e;
    return acc;
  }, {});
  return { ...prices, pages };
}

const staticValue = {
  global: globalContent,
  home: homeContent,
  contact: contactContent,
  prices: buildPricesWithPages(pricesContent),
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
        const hasContact = typeof client.queries.contact === 'function';
        const hasPrices = typeof client.queries.prices === 'function';
        if (hasContact) promises.push(client.queries.contact({ relativePath: 'contact.json' }));
        if (hasPrices) promises.push(client.queries.prices({ relativePath: 'prices.json' }));
        const results = await Promise.all(promises);
        if (cancelled) return;
        const globalData = results[0]?.data?.global;
        const homeData = results[1]?.data?.home;
        const contactData = hasContact ? results[2]?.data?.contact : undefined;
        const pricesData = hasPrices ? results[hasContact ? 3 : 2]?.data?.prices : undefined;
        if (globalData || homeData || contactData || pricesData) {
          setValue((prev) => ({
            ...prev,
            ...(globalData && { global: omitSys(globalData) }),
            ...(homeData && { home: omitSys(homeData) }),
            ...(contactData && { contact: omitSys(contactData) }),
            ...(pricesData && { prices: buildPricesWithPages(omitSys(pricesData)) }),
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

export function usePricesContent() {
  const { prices } = useContent();
  return prices;
}

/** Get price page config by route slug (e.g. 'buy-youtube-views'). Returns null if not found. */
export function usePricePage(slug) {
  const { prices } = useContent();
  const page = prices?.pages?.[slug] ?? null;
  const packages = page
    ? {
        regular: page.packagesRegular ?? [],
        fast: page.packagesFast ?? [],
        ads: page.packagesAds ?? [],
      }
    : null;
  return { page, packages };
}
