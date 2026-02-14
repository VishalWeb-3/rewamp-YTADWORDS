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
    <Link to="/" className="flex items-center gap-0.5 font-bold text-xl tracking-tight">
      <span className="text-black">{youtube}</span>
      <span className="bg-brand-red text-white px-1.5 py-0.5 text-lg">{ad}</span>
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
  const menuRef = useRef(null);
  const cartCount = getCartCount();
  const navItems = header.navLinks || [
    { label: 'Google Ads Services', link: '/' },
    { label: 'YouTube Services', link: '/buy-youtube-views' },
    { label: 'TikTok Ads Services', link: '/' },
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

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo siteName={header.siteName} />
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.link || '#'}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-[#E53935] text-white hover:bg-[#C62828]"
            >
              {item.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-brand-red text-white hover:bg-[#C62828] transition-colors"
              >
                {displayName}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 py-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[140px] z-50">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    {header.myOrders || 'My Orders'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    {header.logout || 'Logout'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              {header.loginLabel || 'Login'}
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              to="/orders"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              {header.myOrders || 'My Orders'}
            </Link>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
            aria-label={header.shoppingCartAria || 'Shopping cart'}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
