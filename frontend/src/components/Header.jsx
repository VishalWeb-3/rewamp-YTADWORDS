import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-0.5 font-bold text-xl tracking-tight">
      <span className="text-black">YOUTUBE</span>
      <span className="bg-brand-red text-white px-1.5 py-0.5 text-lg">AD</span>
      <span className="text-black">WORDS</span>
    </Link>
  );
}

export default function Header() {
  const { setIsCartOpen, getCartCount } = useCart();
  const { user, displayName, logout, isLoggedIn } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cartCount = getCartCount();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Google Ads Services', active: true, link: '/' },
    { label: 'YouTube Services', active: true, link: '/buy-youtube-views' },
    { label: 'TikTok Ads Services', active: true, link: '/' },
    { label: 'Contact', active: false, link: '/contact' },
  ];

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.link || '#'}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-[#E53935] text-white hover:bg-[#C62828]'
                  : 'text-gray-800 hover:text-gray-600'
              }`}
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
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Login
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              to="/orders"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              My Orders
            </Link>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors ml-2"
            aria-label="Shopping cart"
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
