import React, { createContext, useContext, useState, useEffect } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';
import contactContent from '../../content/contact/contact.json';

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
        const results = await Promise.all(promises);
        if (cancelled) return;
        const globalData = results[0]?.data?.global;
        const homeData = results[1]?.data?.home;
        const contactData = results[2]?.data?.contact;
        if (globalData || homeData || contactData) {
          setValue((prev) => ({
            ...prev,
            ...(globalData && { global: omitSys(globalData) }),
            ...(homeData && { home: omitSys(homeData) }),
            ...(contactData && { contact: omitSys(contactData) }),
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
