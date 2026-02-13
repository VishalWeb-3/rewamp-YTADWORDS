import React from 'react';
import { Link } from 'react-router-dom';

const ourServices = [
  'YouTube Views',
  'YouTube Subscribers',
  'YouTube Watch Hours',
  'TikTok Followers',
  'Google Ads Views',
];

const resources = [
  'Blog',
  'Affiliate Program',
  'Why Choose Us?',
  'Actionable Feedback',
  'Corrections Policy',
];

const company = [
  { label: 'About Us', link: '/about-us' },
  { label: 'Contact', link: '/contact' },
  { label: 'Careers', link: '#' },
  { label: 'Partners', link: '#' },
  { label: 'Publishing Principles', link: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-0.5 font-bold text-xl tracking-tight mb-4">
              <span className="text-black">YouTube</span>
              <span className="bg-brand-red text-white px-1.5 py-0.5 text-lg">AD</span>
              <span className="text-black">WORDS</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              YouTube Ad Words empowers creators and brands to transform raw content into viral success. We make growth easier to achieve, understand, and act on.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="#FF0000">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Our Services Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Our Services</h3>
            <ul className="space-y-2">
              {ourServices.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-600 text-sm hover:text-brand-red transition-colors">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Company</h3>
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
            </ul>
          </div>
        </div>

        {/* Middle Section - Legal Disclaimer */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <p className="text-gray-500 text-xs leading-relaxed max-w-4xl">
            All the materials offered by YouTube Ad Words are safeguarded by copyright laws. Unlawful reproduction or distribution of our materials is strictly forbidden. It's important to understand that YouTube Ad Words operates independently and is not associated with any social media platforms. This website is not affiliated with or endorsed by Instagram LLC, YouTube LLC, TikTok Inc., Facebook, or any other social media platform.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 YouTube Ad Words. All rights reserved. | Novence SASU - Cs 48756 Paris
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund-policy" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              Refund Policy
            </Link>
            <a href="#" className="text-gray-500 text-xs hover:text-brand-red transition-colors">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
