import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalContent } from '../../contexts/ContentContext';
import { Bag, Menu, Cross, Chevron } from './icons';

const FALLBACK_NAV = [
  { label: 'Contact', link: '/contact' },
];

const FALLBACK_GROUPS = [
  { label: 'Google Ads Services', items: [{ label: 'Google Skip Ads Views', link: '/buy-google-skip-ads-views' }, { label: 'Google Display Ads Views', link: '/buy-google-display-ads-views' }, { label: 'Google Apps Download', link: '/buy-google-apps-download' }, { label: 'Google Ads Website / App Traffic', link: '/buy-google-ads-website-traffic' }] },
  { label: 'YouTube Services', items: [{ label: 'Buy YouTube Views', link: '/buy-youtube-views' }, { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' }, { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' }, { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' }] },
];

export default function LandingHeader() {
  const global = useGlobalContent();
  const header = global?.header || {};
  const groups = global?.serviceBar?.services?.length ? global.serviceBar.services : FALLBACK_GROUPS;
  const { setIsCartOpen, getCartCount } = useCart();
  const { isLoggedIn, displayName, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(-1);
  const [group, setGroup] = useState(-1);
  const navRef = useRef(null);
  // header links the service menus don't already cover (e.g. Contact)
  const groupLabels = groups.map((g) => g.label);
  const nav = (header.navLinks?.length ? header.navLinks : FALLBACK_NAV).filter((n) => !groupLabels.includes(n.label));
  const count = getCartCount();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const site = (header.siteName || 'YoutubeADwords').toLowerCase() === 'youtubeadwords';
  const close = () => setOpen(false);

  return (
    <header className={`lp-header${stuck ? ' is-stuck' : ''}`}>
      <div className="lp-wrap lp-header-in">
        <Link to="/" className="lp-logo" aria-label="YoutubeADwords home">
          {site ? <><span>Youtube</span><b>AD</b><span>words</span></> : header.siteName}
        </Link>

        <nav className="lp-nav" aria-label="Main" ref={navRef} onMouseLeave={() => setMenu(-1)}>
          {groups.map((g, gi) => (
            <div
              className={`lp-dd${menu === gi ? ' is-open' : ''}`}
              key={g.label}
              onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setMenu(gi); }}
            >
              <button type="button" className="lp-dd-btn" aria-expanded={menu === gi} aria-haspopup="true" onClick={() => setMenu(menu === gi && !window.matchMedia('(hover: hover)').matches ? -1 : gi)}>
                {g.label}<Chevron size={14} />
              </button>
              <ul className="lp-dd-panel">
                {(g.items || []).map((it) => (
                  <li key={it.link}><Link to={it.link} onClick={() => setMenu(-1)}>{it.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          {nav.map((item) => (
            <Link key={item.label} to={item.link || '#'}>{item.label}</Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to="/orders">{header.myOrders || 'My Orders'}</Link>
              <button type="button" className="lp-link" onClick={logout}>{header.logout || 'Logout'}</button>
            </>
          ) : (
            <>
              <Link to="/orders">{header.myOrders || 'My Orders'}</Link>
              <Link to="/login">{header.loginLabel || 'Login'}</Link>
            </>
          )}
          <button type="button" className="lp-icon-btn" onClick={() => setIsCartOpen(true)} aria-label={header.shoppingCartAria || 'Shopping cart'}>
            <Bag />
            {count > 0 && <span className="lp-badge">{count > 9 ? '9+' : count}</span>}
          </button>
        </nav>

        <div className="lp-burger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button type="button" className="lp-icon-btn" onClick={() => setIsCartOpen(true)} aria-label={header.shoppingCartAria || 'Shopping cart'}>
            <Bag />
            {count > 0 && <span className="lp-badge">{count > 9 ? '9+' : count}</span>}
          </button>
          <button type="button" className="lp-icon-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
        </div>
      </div>

      {open && (
        <div className="lp-sheet" role="dialog" aria-modal="true" aria-label="Menu">
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={close} aria-label="Close menu" style={{ border: 0, fontSize: 0, padding: '0.5rem' }}><Cross size={26} /></button>
          </div>
          {groups.map((g, gi) => (
            <div className="lp-acc" key={g.label}>
              <button type="button" aria-expanded={group === gi} onClick={() => setGroup(group === gi ? -1 : gi)}>
                {g.label}<Chevron size={22} />
              </button>
              {group === gi && (
                <div className="lp-acc-body">
                  {(g.items || []).map((it) => <Link key={it.link} to={it.link} onClick={close}>{it.label}</Link>)}
                </div>
              )}
            </div>
          ))}
          {nav.map((item) => (
            <Link key={item.label} to={item.link || '#'} onClick={close}>{item.label}</Link>
          ))}
          <Link to="/orders" onClick={close}>{header.myOrders || 'My Orders'}</Link>
          {isLoggedIn ? (
            <button type="button" onClick={() => { logout(); close(); }}>{header.logout || 'Logout'} {displayName ? `(${displayName})` : ''}</button>
          ) : (
            <Link to="/login" onClick={close}>{header.loginLabel || 'Login'}</Link>
          )}
        </div>
      )}
    </header>
  );
}
