import React from 'react';
import { Link } from 'react-router-dom';

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
  const navItems = [
    { label: 'Google Ads Services', active: true, link: '/' },
    { label: 'YouTube Services', active: true, link: '/buy-youtube-views' },
    { label: 'TikTok Ads Services', active: true, link: '/' },
    { label: 'Customer Area', active: false, link: '#' },
    { label: 'Contact', active: false, link: '#' },
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
        </nav>
      </div>
    </header>
  );
}
