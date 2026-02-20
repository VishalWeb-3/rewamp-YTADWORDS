import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useGlobalContent } from '../contexts/ContentContext';

function Logo({ siteName }) {
  const raw = (siteName || 'YOUTUBEADWORDS').trim();
  const parts = raw.split(/\s+/);
  let youtube = 'YOUTUBE', ad = 'AD', words = 'WORDS';
  if (parts.length >= 3) {
    [youtube, ad, words] = parts;
  } else if (parts.length === 1 && raw.toUpperCase() === 'YOUTUBEADWORDS') {
    youtube = 'YOUTUBE'; ad = 'AD'; words = 'WORDS';
  } else if (parts.length >= 1) {
    youtube = parts[0] || youtube;
  }
  return (
    <Link to="/" className="flex items-center gap-0.5 font-bold text-base sm:text-xl tracking-tight">
      <span className="text-black">{youtube}</span>
      <span className="bg-brand-red text-white px-1 sm:px-1.5 py-0.5 text-sm sm:text-lg">{ad}</span>
      <span className="text-black">{words}</span>
    </Link>
  );
}

export default function Header() {
  const globalContent = useGlobalContent();
  const header = globalContent?.header || {};
  const { setIsCartOpen, getCartCount } = useCart();
  const { user, displayName, logout, isLoggedIn } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuHover, setUserMenuHover] = useState(false);
  const menuRef = useRef(null);
  const cartCount = getCartCount();
  const navItems = header.navLinks || [
    { label: 'Google Ads Services', link: '/' },
    { label: 'YouTube Services', link: '/buy-youtube-views' },
    { label: 'TikTok Ads Services', link: '/' },
    { label: 'Buy Google Reviews', link: '/buy-male-google-reviews' },
    { label: 'Blog', link: '/blog' },
    { label: 'Contact', link: '/contact' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showUserDropdown = userMenuOpen || userMenuHover;

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const NavLinks = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.link || '#'}
          onClick={isMobile ? closeMobileMenu : undefined}
          className={`transition-colors bg-[#E53935] text-white hover:bg-[#C62828] ${isMobile
              ? 'block px-6 py-4 text-base font-medium border-b border-white/20'
              : 'px-3 sm:px-4 py-2 rounded-full text-sm font-medium'
            }`}
        >
          {item.label}
        </Link>
      ))}
      {isLoggedIn ? (
        <div className={isMobile ? '' : 'relative'} ref={isMobile ? null : menuRef}>
          {isMobile ? (
            <>
              <div className="px-6 py-3 text-sm text-gray-400 border-b border-white/20">{displayName}</div>
              <Link
                to="/orders"
                className="block px-6 py-4 text-base text-white hover:bg-white/10"
                onClick={closeMobileMenu}
              >
                {header.myOrders || 'My Orders'}
              </Link>
              <Link
                to="/contact"
                className="block px-6 py-4 text-base text-white hover:bg-white/10"
                onClick={closeMobileMenu}
              >
                {header.ticketsLabel || 'Tickets / Support'}
              </Link>
              <button
                type="button"
                onClick={() => { logout(); closeMobileMenu(); }}
                className="block w-full text-left px-6 py-4 text-base text-red-500 hover:bg-white/10 font-medium"
              >
                {header.logout || 'Logout'}
              </button>
            </>
          ) : (
            <>
              <div
                ref={menuRef}
                className="relative"
                onMouseEnter={() => setUserMenuHover(true)}
                onMouseLeave={() => setUserMenuHover(false)}
              >
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="px-3 sm:px-4 py-2 rounded-full text-sm font-medium bg-brand-red text-white hover:bg-[#C62828] transition-colors"
                >
                  {displayName}
                </button>
                {showUserDropdown && (
                  <>
                    {/* Invisible bridge to prevent gap hover issue */}
                    <div className="absolute right-0 top-full w-full h-2" />
                    <div className="absolute right-0 top-full pt-2 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[160px] z-50">
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                        onClick={() => { setUserMenuOpen(false); setUserMenuHover(false); }}
                      >
                        {header.myOrders || 'My Orders'}
                      </Link>
                      <Link
                        to="/contact"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => { setUserMenuOpen(false); setUserMenuHover(false); }}
                      >
                        {header.ticketsLabel || 'Tickets / Support'}
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setUserMenuOpen(false); setUserMenuHover(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                      >
                        {header.logout || 'Logout'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          onClick={isMobile ? closeMobileMenu : undefined}
          className={isMobile ? 'block px-6 py-4 text-base font-medium text-white hover:bg-white/10 border-b border-white/20' : 'px-3 sm:px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors'}
        >
          {header.loginLabel || 'Login'}
        </Link>
      )}
      {!isLoggedIn && (
        <Link
          to="/orders"
          onClick={isMobile ? closeMobileMenu : undefined}
          className={isMobile ? 'block px-6 py-4 text-base font-medium text-white hover:bg-white/10' : 'px-3 sm:px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors'}
        >
          {header.myOrders || 'My Orders'}
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Logo siteName={header.siteName} />
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLinks />
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
            aria-label={header.shoppingCartAria || 'Shopping cart'}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </nav>
        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={header.shoppingCartAria || 'Shopping cart'}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobileMenu} aria-hidden="true" />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-[min(100%,320px)] bg-gray-900 shadow-2xl overflow-y-auto pt-4">
            <nav className="flex flex-col">
              <NavLinks isMobile />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
