// Renders one imported revamp page exactly as built (its own HTML and CSS), then plugs this site's
// live pieces into the page's placeholders:
//   [data-yaw-purchase]      product purchase panel (Tina prices, cart, Buy now)
//   page nav                 replaced by RevampNav (the original header's options)
//   forms                    support tickets (wireForms.js); My Orders list (RevampOrders)
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import SEO from '../components/SEO';
import DiscountPopup from '../components/DiscountPopup';
import { useAuth } from '../contexts/AuthContext';
import { useContactContent, useGlobalContent, usePageMetadata } from '../contexts/ContentContext';
import { useCtaActions } from '../contexts/CtaActionsContext';
import { runInteractions } from './interactions';
import { wireForms } from './wireForms';
import { matchFlows } from './matchFlows';
import { PurchasePanel, CartDrawer } from './commerce';
import RevampNav from './RevampNav';
import RevampOrders from './RevampOrders';
import './revamp.css';
import './revamp-site.css';

const loaders = import.meta.glob('./pages/*.json', { import: 'default' });

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: true, prevent: (node) => node.classList.contains('clone-mobile-menu') });
    // Pause smooth scrolling while the cart drawer or phone menu locks the page
    const html = document.documentElement;
    const sync = () => (html.classList.contains('yaw-locked') ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => { observer.disconnect(); lenis.destroy(); };
  }, []);
}

export default function RevampPage({ pageKey, metaSlug, title, description, onReady, children }) {
  const [page, setPage] = useState(null);
  const [mounts, setMounts] = useState({ purchase: [], orders: [] });
  const rootRef = useRef(null);
  // Page-specific fill-in (e.g. Tina blog posts) once the HTML is in place; a ref so a new callback doesn't re-arm the page
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { isEnabled } = useCtaActions();
  const canSubmitTicket = isEnabled('submit_ticket');
  const footer = useGlobalContent()?.footer;
  const contact = useContactContent();
  const meta = usePageMetadata(metaSlug);
  useSmoothScroll();

  useEffect(() => {
    let cancelled = false;
    setPage(null);
    setMounts({ purchase: [], orders: [] });
    const load = loaders[`./pages/${pageKey}.json`];
    if (load) load().then((data) => { if (!cancelled) setPage(data); });
    return () => { cancelled = true; };
  }, [pageKey]);

  // Behaviour, form wiring and mount points, once the page's HTML is in the document
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!page || !root) return undefined;
    const stopInteractions = runInteractions(root, { account: { isLoggedIn, logout } });
    const stopForms = wireForms(root, {
      canSubmitTicket,
      search: location.search,
      state: location.state,
      contact,
      // email boxes open the Contact page with the email filled in (router state, not the URL)
      goToContact: (email) => navigate('/contact', { state: email ? { email } : null }),
    });
    const stopFlows = matchFlows(root, { isLoggedIn, logout, footer });
    const purchase = Array.from(root.querySelectorAll('[data-yaw-purchase]')).map((el) => ({ el, slug: el.getAttribute('data-yaw-purchase') }));
    const orders = Array.from(root.querySelectorAll('[data-orders-empty]'));
    // The page's own nav is replaced by RevampNav (the original header's options in the revamp's look)
    const hiddenNavs = Array.from(root.querySelectorAll('nav')).map((nav) => nav.closest('[class$="-container"]') || nav);
    hiddenNavs.forEach((el) => { el.style.display = 'none'; });
    setMounts({ purchase, orders });
    const stopReady = onReadyRef.current?.(root);
    return () => {
      if (typeof stopReady === 'function') stopReady();
      stopInteractions();
      stopForms();
      stopFlows();
      hiddenNavs.forEach((el) => { el.style.display = ''; });
    };
    // location.search/state only preset the ticket form; re-arming on every query change isn't needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isLoggedIn, canSubmitTicket, footer, contact]);

  return (
    <>
      <SEO title={title || meta?.title || page?.title || 'YoutubeADwords'} description={description || meta?.description || page?.description} keywords={meta?.keywords || ''} ogImage={meta?.ogImage || '/favicon.svg'} />
      {page && <style>{page.css}</style>}
      <RevampNav />
      {page ? <div id="template-root" ref={rootRef} data-route={page.route} dangerouslySetInnerHTML={{ __html: page.html }} /> : <div className="revamp-loading" aria-busy="true" />}
      {mounts.purchase.map(({ el, slug }) => createPortal(<PurchasePanel slug={slug} />, el, `p-${slug}`))}
      {mounts.orders.map((el, i) => <RevampOrders key={`o${i}`} emptyState={el} />)}
      {page && children}
      <CartDrawer />
      <DiscountPopup />
    </>
  );
}
