// The site navbar in the revamp's look, with the original header's options and behaviour (LandingHeader):
// Google Ads Services and YouTube Services menus and the header links from Tina (content/global),
// My Orders, Login or Logout, and the cart. Phones get the revamp's menu sheet with the same options.
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalContent } from '../contexts/ContentContext';

const FALLBACK_NAV = [{ label: 'Contact', link: '/contact' }];
const FALLBACK_GROUPS = [
  { label: 'Google Ads Services', items: [{ label: 'Google Skip Ads Views', link: '/buy-google-skip-ads-views' }, { label: 'Google Display Ads Views', link: '/buy-google-display-ads-views' }, { label: 'Google Apps Download', link: '/buy-google-apps-download' }, { label: 'Google Ads Website / App Traffic', link: '/buy-google-ads-website-traffic' }] },
  { label: 'YouTube Services', items: [{ label: 'Buy YouTube Views', link: '/buy-youtube-views' }, { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' }, { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' }, { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' }] },
];

const Chevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
const Bag = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 7h12l1 13H5L6 7Zm3 0V6a3 3 0 0 1 6 0v1" /></svg>;

function Pill({ to, onClick, pink, children }) {
  const face = <span className={`gh-pill-face${pink ? ' is-pink' : ''}`}>{children}</span>;
  return to
    ? <Link to={to} className="gh-pill">{face}</Link>
    : <button type="button" className="gh-pill" onClick={onClick}>{face}</button>;
}

export default function RevampNav() {
  const global = useGlobalContent();
  const header = global?.header || {};
  const groups = global?.serviceBar?.services?.length ? global.serviceBar.services : FALLBACK_GROUPS;
  const { setIsCartOpen, getCartCount } = useCart();
  const { isLoggedIn, displayName, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(-1);
  const [group, setGroup] = useState(-1);
  const navRef = useRef(null);
  // header links the service menus don't already cover (e.g. Contact)
  const groupLabels = groups.map((g) => g.label);
  const nav = (header.navLinks?.length ? header.navLinks : FALLBACK_NAV).filter((n) => !groupLabels.includes(n.label));
  const count = getCartCount();
  const site = (header.siteName || 'YoutubeADwords').toLowerCase() === 'youtubeadwords';
  const hover = () => window.matchMedia('(hover: hover)').matches;

  useEffect(() => { setMenu(-1); setOpen(false); }, [pathname]);

  useEffect(() => {
    if (menu < 0) return undefined;
    const onDown = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setMenu(-1); };
    const onKey = (e) => { if (e.key === 'Escape') setMenu(-1); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, [menu]);

  useEffect(() => {
    document.documentElement.classList.toggle('yaw-locked', open);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) document.addEventListener('keydown', onKey);
    return () => { document.documentElement.classList.remove('yaw-locked'); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const close = () => setOpen(false);
  const cartButton = (
    <button type="button" className="yaw-cart-btn" onClick={() => setIsCartOpen(true)} aria-label={header.shoppingCartAria || 'Shopping cart'}>
      <Bag />{count > 0 && <span className="yaw-cart-count">{count > 9 ? '9+' : count}</span>}
    </button>
  );

  return (
    <header className="gh-nav-wrap">
      <div className="gh-nav">
        <Link to="/" className="yaw-logo-link" aria-label="YoutubeADwords home">
          <span className="yaw-logo">{site ? <>Youtube<b>AD</b>words</> : header.siteName}</span>
        </Link>

        <nav className="gh-nav-links" aria-label="Main" ref={navRef} onMouseLeave={() => setMenu(-1)}>
          {groups.map((g, gi) => (
            <div className={`gh-dd${menu === gi ? ' is-open' : ''}`} key={g.label} onMouseEnter={() => { if (hover()) setMenu(gi); }}>
              <button type="button" className="gh-nav-link" aria-expanded={menu === gi} aria-haspopup="true" onClick={() => setMenu(menu === gi && !hover() ? -1 : gi)}>
                {g.label}<Chevron />
              </button>
              <ul className="gh-dd-panel">
                {(g.items || []).map((it) => (
                  <li key={it.link}><Link to={it.link} onClick={() => setMenu(-1)}>{it.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          {nav.map((item) => <Link key={item.label} to={item.link || '#'} className="gh-nav-link">{item.label}</Link>)}
        </nav>

        <div className="gh-nav-actions">
          <span className="gh-desktop"><Pill to="/orders">{header.myOrders || 'My Orders'}</Pill></span>
          {cartButton}
          <span className="gh-desktop">
            {isLoggedIn
              ? <Pill pink onClick={logout}>{header.logout || 'Logout'}</Pill>
              : <Pill pink to="/login">{header.loginLabel || 'Login'}</Pill>}
          </span>
          <button type="button" className="gh-burger" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            <i /><i />
          </button>
        </div>
      </div>

      {open && (
        <nav className="clone-mobile-menu" aria-label="Menu" data-lenis-prevent>
          {groups.map((g, gi) => (
            <div className="clone-mobile-group" key={g.label}>
              <button type="button" className="gh-acc" aria-expanded={group === gi} onClick={() => setGroup(group === gi ? -1 : gi)}>
                {g.label}<Chevron />
              </button>
              {group === gi && (g.items || []).map((it) => (
                <Link key={it.link} to={it.link} onClick={close} aria-current={pathname === it.link ? 'page' : undefined}>{it.label}</Link>
              ))}
            </div>
          ))}
          <div className="clone-mobile-group">
            {nav.map((item) => <Link key={item.label} to={item.link || '#'} onClick={close}>{item.label}</Link>)}
          </div>
          <div className="clone-mobile-account">
            <Link to="/orders" onClick={close}>{header.myOrders || 'My Orders'}</Link>
            {isLoggedIn
              ? <Link to="/" onClick={(e) => { e.preventDefault(); logout(); close(); }}>{header.logout || 'Logout'} {displayName ? `(${displayName})` : ''}</Link>
              : <Link to="/login" onClick={close}>{header.loginLabel || 'Login'}</Link>}
          </div>
        </nav>
      )}
    </header>
  );
}
