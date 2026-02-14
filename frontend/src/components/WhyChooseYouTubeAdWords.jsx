import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

export default function WhyChooseYouTubeAdWords() {
  const home = useHomeContent();
  const section = home?.whyChooseYouTubeAdWords || {};
  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-bold mb-2" style={{ fontSize: "22px", lineHeight: "1.2" }}>
            {section.heading1 || 'Why Should You Choose'}
          </h2>
          <h2 className="font-bold" style={{ fontSize: "22px", lineHeight: "1.2" }}>
            <span className="text-brand-red">{section.heading2YouTube || 'YouTube'}</span>{' '}
            <span className="text-blue-700">{section.heading2AdWords || 'Ad Words?'}</span>
          </h2>
        </div>

        {/* Two Cards Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex-1" style={{ fontSize: "16px", lineHeight: "1.2" }}>
                {section.card1Title || 'Advanced Google Ads & Algorithm Mastery'}
              </h3>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center ml-4">
                <span
                  className="font-bold text-gray-700"
                  style={{ fontSize: "20px" }} // 2px less than 22px
                >!</span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed" style={{ fontSize: "14px" }}>
              {section.card1Text || 'YouTube Ad Words leverages precision targeting, deep YouTube algorithm knowledge, and proven Google Ads strategies to deliver authentic traffic that drives real growth, retention, and better ranking for your content.'}
            </p>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10 relative">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex-1" style={{ fontSize: "16px", lineHeight: "1.2" }}>
                {section.card2Title || '100% Safe, Secure & Compliant Growth'}
              </h3>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center ml-4">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {/* 2px smaller size for icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed" style={{ fontSize: "14px" }}>
              {section.card2Text || 'Our "White-Hat" approach ensures YouTube Ad Words complies with all platform policies, protects against bot activity, and maintains your account security while delivering genuine, high-quality engagement.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
