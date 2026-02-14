import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

export default function Hero() {
  const home = useHomeContent();
  const hero = home?.hero || {};
  return (
    <section className="min-h-[calc(100vh-180px)] bg-gray-100 bg-dot-pattern bg-[length:20px_20px]">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left column */}
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-green-light">
              <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-800">{hero.badge || '2.4M+ Quality Ad Views Delivered'}</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {hero.title ? (
              (() => {
                const t = hero.title;
                const a = 'Google Ads', b = 'TikTok';
                const i1 = t.indexOf(a), i2 = t.indexOf(b);
                if (i1 === -1 || i2 === -1) return t;
                return (
                  <>
                    {t.slice(0, i1)}
                    <span className="text-brand-red">{a}</span>
                    {t.slice(i1 + a.length, i2)}
                    <span className="text-brand-red">{b}</span>
                    {t.slice(i2 + b.length)}
                  </>
                );
              })()
            ) : (
              <>
                Boost Your <span className="text-brand-red">Google Ads</span>
                {' '}& <span className="text-brand-red">TikTok</span>
                {' '}Campaigns with Authentic, High-Quality Traffic
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {hero.subtitle || "Experience rapid growth with YouTubeAdWords' premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide."}
          </p>
          <div className="flex flex-wrap gap-4 mb-6">
            <a href="#" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-brand-red text-white font-semibold text-base hover:bg-brand-red-dark transition-colors">
              {hero.ctaPrimary || 'Start Your Campaign'}
            </a>
            <a href="#" className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white border-2 border-gray-300 text-gray-800 font-semibold text-base hover:border-gray-400 hover:bg-gray-50 transition-colors">
              {hero.ctaSecondary || 'View Pricing'}
            </a>
          </div>
          <p className="text-sm text-gray-500 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {hero.lastOrder || 'Last Order: 15 mins ago'}
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {hero.activeCampaigns || '1,200+ Active Campaigns'}
            </span>
          </p>
        </div>

        <div className="flex-1 relative w-full max-w-2xl min-h-[480px] flex items-center justify-center">
          <img
            src="/youtubeadwords_1.webp"
            alt={hero.heroImageAlt || 'YouTube AdWords - Boost your Google Ads & TikTok campaigns'}
            className="w-full h-auto max-h-[520px] object-contain object-center rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
