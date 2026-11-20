// The imported pages are plain HTML with ordinary <a href> links. This sends same-site clicks through
// React Router (no full reload, cart and session state kept), except /admin (TinaCMS) and /api.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FULL_LOAD = /^\/(admin|api)(\/|$)/;

export default function LinkRouter() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || FULL_LOAD.test(url.pathname)) return;
      // In-page anchors are left to the browser (and Lenis)
      if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;
      e.preventDefault();
      const path = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : url.pathname;
      navigate(`${path}${url.search}${url.hash}`);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
  return null;
}
