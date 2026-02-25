import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContent } from '../contexts/ContentContext';
import { useAuth } from '../contexts/AuthContext';

export default function Footer() {
  const globalContent = useGlobalContent();
  const { isLoggedIn, logout } = useAuth();
  const footer = globalContent?.footer || {};
  // Only include services that have actual pages
  const ourServices = footer.ourServices || [
    { label: 'Buy YouTube Views', link: '/buy-youtube-views' },
    { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' },
    { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' },
    { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' },
    { label: 'Buy TikTok Followers', link: '/buy-tiktok-followers' },
    { label: 'Buy Google Reviews', link: '/buy-female-google-reviews' },
  ];

  // Only include resources that have actual pages
  const resources = footer.resources || [
    { label: 'Blog', link: '/blog' },
  ];

  // Only include company pages that exist
  const company = footer.company || [
    { label: 'About Us', link: '/about-us' },
    { label: 'Tickets / Support', link: '/tickets' },
  ];
  return (
    <footer className="bg-white border-t border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-0.5 font-bold text-xl tracking-tight mb-4">
              <span className="text-black">Youtube</span>
              <span className="bg-brand-red text-white px-1.5 py-0.5 text-lg">AD</span>
              <span className="text-black">words</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              {footer.tagline || 'YoutubeADwords empowers creators and brands to transform raw content into viral success. We make growth easier to achieve, understand, and act on.'}
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href={footer.socials?.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href={footer.socials?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={footer.socials?.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
                </svg>
              </a>
              <a
                href={footer.socials?.pinterest || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Our Services Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{footer.ourServicesTitle || 'Our Services'}</h3>
            <ul className="space-y-2">
              {ourServices.map((service, index) => {
                const serviceData = typeof service === 'string' ? { label: service, link: '#' } : service;
                return (
                  <li key={index}>
                    {serviceData.link !== '#' ? (
                      <Link to={serviceData.link} className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                        {serviceData.label}
                      </Link>
                    ) : (
                      <span className="text-gray-600 text-sm">{serviceData.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{footer.resourcesTitle || 'Resources'}</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => {
                const resourceData = typeof resource === 'string' ? { label: resource, link: resource === 'Blog' ? '/blog' : '#' } : resource;
                return (
                  <li key={index}>
                    {resourceData.link !== '#' ? (
                      <Link to={resourceData.link} className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                        {resourceData.label}
                      </Link>
                    ) : (
                      <span className="text-gray-600 text-sm">{resourceData.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">{footer.companyTitle || 'Company'}</h3>
            <ul className="space-y-2">
              {company.map((item, index) => (
                <li key={index}>
                  {item.link !== '#' ? (
                    <Link to={item.link} className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <a href="#" className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <button
                    onClick={logout}
                    className="text-red-600 text-sm hover:text-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Middle Section - Legal Disclaimer */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <p className="text-gray-500 text-xs leading-relaxed max-w-4xl">
            {footer.legalDisclaimer || "All the materials offered by YoutubeADwords are safeguarded by copyright laws. Unlawful reproduction or distribution of our materials is strictly forbidden. It's important to understand that YoutubeADwords operates independently and is not associated with any social media platforms. This website is not affiliated with or endorsed by Instagram LLC, YouTube LLC, TikTok Inc., Facebook, or any other social media platform."}
          </p>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-xs max-w-full">
            {footer.copyright || '© 2026 YoutubeADwords. All rights reserved. | Novence SASU - Cs 48756 Paris'}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4">
            <Link to="/privacy-policy" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              {footer.privacyPolicy || 'Privacy Policy'}
            </Link>
            <Link to="/terms" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              {footer.termsOfService || 'Terms of Service'}
            </Link>
            <Link to="/refund-policy" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              {footer.refundPolicy || 'Refund Policy'}
            </Link>
            <Link to="/cookies" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              {footer.cookiesSettings || 'Cookies Settings'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
