import React, { createContext, useContext } from 'react';

// Tina-driven content: import from content/ (editable via Tina Cloud or directly in repo)
import globalContent from '../../content/global/index.json';
import homeContent from '../../content/home/home.json';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const value = {
    global: globalContent,
    home: homeContent,
  };
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
