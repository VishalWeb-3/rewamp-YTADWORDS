import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeContent } from '../contexts/ContentContext';

const serviceCategories = [
  {
    label: 'Google Ads Services',
    icon: 'G',
    services: [
      { label: 'Google Skip Ads Views', icon: 'play', link: '/buy-google-skip-ads-views' },
      { label: 'Google Display Ads Views', icon: 'play', link: '/buy-google-display-ads-views' },
      { label: 'Google Discovery Ads Views', icon: 'play', link: '/buy-google-discovery-ads-views' },
      { label: 'Google Ads Search Campaign Traffic', icon: 'play', link: '/buy-google-ads-search-traffic' },
      { label: 'Google Ads Website / App Traffic', icon: 'play', link: '/buy-google-ads-website-traffic' },
    ],
  },
  {
    label: 'YouTube Services',
    icon: 'youtube',
    services: [
      { label: 'Buy YouTube Views', icon: 'play', link: '/buy-youtube-views' },
      { label: 'Buy YouTube Subscribers', icon: 'users', link: '/buy-youtube-subscribers' },
      { label: 'Buy YouTube Likes', icon: 'thumbs', link: '/buy-youtube-likes' },
      { label: 'Buy YouTube Watch Hours', icon: 'clock', link: '/buy-youtube-watch-hours' },
    ],
  },
  {
    label: 'TikTok Ads Services',
    icon: 'tiktok',
    services: [
      { label: 'TikTok Followers Growth', icon: 'users', link: '/buy-tiktok-followers' },
      { label: 'TikTok Ads Views', icon: 'eye', link: '/buy-tiktok-ads-views' },
      { label: 'TikTok Reach / Impressions', icon: 'eye', link: '/buy-tiktok-reach' },
      { label: 'TikTok Engagement Services', icon: 'heart', link: '/buy-tiktok-engagement' },
      { label: 'TikTok Video Views', icon: 'eye', link: '/buy-tiktok-video-views' },
      { label: 'TikTok Website / App Traffic', icon: 'eye', link: '/buy-tiktok-traffic' },
    ],
  },
  {
    label: 'Buy Google Reviews',
    icon: 'star',
    services: [
      { label: 'Buy Female Google Reviews', icon: 'star', link: '/buy-female-google-reviews' },
      { label: 'Buy Male Google Reviews', icon: 'star', link: '/buy-male-google-reviews' },
      { label: 'Buy USA Google Reviews', icon: 'star', link: '/buy-usa-google-reviews' },
      { label: 'Buy Google Local Guide Reviews', icon: 'star', link: '/buy-google-local-guide-reviews' },
      { label: 'Buy Google Reviews by Age Group', icon: 'star', link: '/buy-google-reviews-by-age-group' },
    ],
  },
];

function ServiceIcon({ type }) {
  switch (type) {
    case 'play':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'thumbs':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      );
    case 'clock':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'heart':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'eye':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      );
    case 'star':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

function CategoryIcon({ type }) {
  switch (type) {
    case 'G':
      return (
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 font-bold text-lg">
          G
        </span>
      );
    case 'youtube':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      );
    case 'star':
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function GlobalAudienceCTA() {
  const home = useHomeContent();
  const globalCta = home?.globalAudienceCta || {};
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-brand-red rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 lg:p-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 leading-tight">
                {(globalCta?.title ?? 'Expanding your reach')}
                <br />
                {(globalCta?.titleHighlight ?? 'to a Global Audience')}
              </h2>
              <p className="text-white/90 text-sm lg:text-base leading-relaxed mb-4">
                {globalCta?.paragraph1 ?? "Stop waiting, start growing. At YouTube Ad Words, we don't just sell stats; we fuel careers. Whether you need to cross the monetization threshold or dominate the TikTok algorithm, our premium packages are designed for instant impact."}
              </p>
              <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                {globalCta?.paragraph2 ?? 'Join thousands of creators who trust us for safe, affordable, and high-retention growth. Select your platform and launch your campaign in seconds.'}
              </p>
            </div>

            {/* Right - Light Pink Card with 4 Buttons */}
            <div className="bg-red-100/80 rounded-2xl p-6 lg:p-8 relative">
              <div className="space-y-3">
                {serviceCategories.map((category, index) => (
                  <div
                    key={index}
                    className="relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Category Button */}
                    <button className="w-full bg-white/90 hover:bg-white text-gray-800 rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-200 shadow-sm">
                      <CategoryIcon type={category.icon} />
                      <span className="font-medium text-xs lg:text-sm flex-1 text-left">{category.label}</span>
                      <svg className={`w-4 h-4 text-gray-600 transition-transform duration-300 ease-in-out ${hoveredIndex === index ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded Dropdown - smooth slide up */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        hoveredIndex === index
                          ? 'max-h-[500px] opacity-100 mt-2'
                          : 'max-h-0 opacity-0 mt-0'
                      }`}
                    >
                      <div className={`bg-red-50/90 rounded-lg p-4 shadow-md transform transition-transform duration-300 ${
                        hoveredIndex === index ? 'translate-y-0' : '-translate-y-2'
                      }`}>
                        <h3 className="text-[0.625rem] font-bold text-gray-800 uppercase tracking-wider mb-3">
                          {category.label.toUpperCase()}
                        </h3>
                        <div className="space-y-2">
                          {category.services.map((service, sIndex) => (
                            <Link
                              key={sIndex}
                              to={service.link || '#'}
                              className={`w-full rounded-lg px-4 py-2.5 flex items-center justify-between transition-colors duration-200 text-xs ${
                                category.label === 'TikTok Ads Services'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-white hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              <span className="font-medium">{service.label}</span>
                              <ServiceIcon type={service.icon} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
