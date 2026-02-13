import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    label: 'Google Ads Services',
    icon: (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-[#4285F4] font-bold text-lg">
        G
      </span>
    ),
    textClass: 'text-gray-600',
    items: [
      'Google Skip Ads Views',
      'Google Display Ads Views',
      'Google Discovery Ads Views',
      'Google Ads Search Campaign Traffic',
      'Google Ads Website / App Traffic',
    ],
  },
  {
    label: 'YouTube Services',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    textClass: 'text-red-600',
    items: [
      { label: 'Buy YouTube Views', link: '/buy-youtube-views' },
      { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' },
      { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' },
      { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' },
    ],
  },
  {
    label: 'TikTok Ads Services',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    textClass: 'text-gray-800',
    items: [
      'TikTok Followers Growth',
      'TikTok Ads Views',
      'TikTok Reach / Impressions',
      'TikTok Engagement Services',
      'TikTok Video Views',
      'TikTok Website / App Traffic',
    ],
  },
  {
    label: 'Buy Google Reviews',
    icon: (
      <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    textClass: 'text-green-600',
    items: [
      'Buy Female Google Reviews',
      'Buy Male Google Reviews',
      'Buy USA Google Reviews',
      'Buy Google Local Guide Reviews',
      'Buy Google Reviews by Age Group',
    ],
  },
];

export default function ServiceBar() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {services.map((s, index) => (
            <div
              key={s.label}
              className="relative"
              onMouseEnter={() => setOpenIndex(index)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              <button
                className={`flex items-center gap-3 px-3 py-2 rounded-full bg-white border shadow-sm transition-all ${
                  openIndex === index
                    ? 'border-red-400 shadow-md bg-red-50'
                    : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                }`}
              >
                {s.icon}
                <span className={`text-sm font-medium ${openIndex === index ? 'text-red-600' : s.textClass}`}>
                  {s.label}
                </span>
              </button>

              {openIndex === index && (
                <div className="absolute left-0 top-full pt-1 z-50 min-w-[240px]">
                  <div className="rounded-lg border border-gray-200 bg-white shadow-lg py-1">
                    {s.items.map((item, itemIndex) => {
                      const itemData = typeof item === 'string' ? { label: item, link: '#' } : item;
                      const Component = itemData.link !== '#' ? Link : 'a';
                      const props = itemData.link !== '#' 
                        ? { to: itemData.link }
                        : { href: '#' };
                      
                      return (
                        <Component
                          key={itemIndex}
                          {...props}
                          className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          {itemData.label}
                        </Component>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
