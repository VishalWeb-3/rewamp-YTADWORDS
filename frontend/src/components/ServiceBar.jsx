import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContent } from '../contexts/ContentContext';

const ICONS = {
  google: () => (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-[#4285F4] font-bold text-lg">G</span>
  ),
  youtube: () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  reviews: () => (
    <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

export default function ServiceBar() {
  const globalContent = useGlobalContent();
  const serviceBar = globalContent?.serviceBar || {};
  const servicesFromContent = serviceBar.services || [];
  const [openIndex, setOpenIndex] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const iconKeys = ['google', 'youtube'];

  useEffect(() => {
    const checkTouch = () => setIsTouchDevice(!window.matchMedia('(hover: hover)').matches);
    checkTouch();
    window.matchMedia('(hover: hover)').addEventListener('change', checkTouch);
    return () => window.matchMedia('(hover: hover)').removeEventListener('change', checkTouch);
  }, []);
  const services = servicesFromContent.length
    ? servicesFromContent.map((s, i) => ({
      label: s.label,
      items: s.items || [],
      icon: ICONS[iconKeys[i]] || ICONS.google,
      textClass: i === 1 ? 'text-red-600' : 'text-gray-800',
    }))
    : [
      { label: 'Google Ads Services', items: [{ label: 'Google Skip Ads Views', link: '/buy-google-skip-ads-views' }, { label: 'Google Display Ads Views', link: '/buy-google-display-ads-views' }, { label: 'Google Apps Download', link: '/buy-google-apps-download' }, { label: 'Google Ads Website / App Traffic', link: '/buy-google-ads-website-traffic' }], icon: ICONS.google, textClass: 'text-gray-600' },
      { label: 'YouTube Services', items: [{ label: 'Buy YouTube Views', link: '/buy-youtube-views' }, { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' }, { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' }, { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' }], icon: ICONS.youtube, textClass: 'text-red-600' },
    ];

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
        <div className="svc-bar flex items-center justify-center gap-2 flex-wrap">
          {services.map((s, index) => {
            const firstItem = s.items && s.items[0];
            const firstLink = typeof firstItem === 'object' && firstItem?.link && firstItem.link !== '#' ? firstItem.link : null;
            const ButtonOrLink = firstLink ? Link : 'button';
            const buttonProps = firstLink
              ? { to: firstLink }
              : { onClick: () => handleToggle(index) };
            return (
              <div
                key={s.label}
                className="relative"
                onMouseEnter={() => !isTouchDevice && setOpenIndex(index)}
                onMouseLeave={() => !isTouchDevice && setOpenIndex(null)}
              >
                <ButtonOrLink
                  {...buttonProps}
                  className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-full bg-white border shadow-sm transition-all ${openIndex === index
                    ? 'border-red-400 shadow-md bg-red-50'
                    : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                    }`}
                >
                  {typeof s.icon === 'function' ? s.icon() : s.icon}
                  <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${openIndex === index ? 'text-red-600' : s.textClass}`}>
                    {s.label}
                  </span>
                </ButtonOrLink>

                {openIndex === index && (
                  <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full pt-1 z-50 min-w-[220px] sm:min-w-[240px]">
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
