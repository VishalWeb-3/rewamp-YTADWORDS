import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

const DEFAULT_BENEFITS = [
  'Genuine views delivered via Google Ads networks',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Includes Video, Display, Discovery, and Search traffic',
  'Scalable packages (Minimum 500 up to 500k+)',
  '100% Manual verification & WhatsApp support',
];

export default function PremiumSolutions() {
  const home = useHomeContent();
  const section = home?.premiumSolutions || {};
  const benefits = section.benefits?.length ? section.benefits : DEFAULT_BENEFITS;
  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            {section.title || 'Our Premium Advertising Solutions'}
          </h2>
          <div className="w-16 h-0.5 bg-brand-red mx-auto mb-4" />
          <h3 className="text-2xl lg:text-3xl font-bold text-brand-red">
            {section.subtitle || 'Buy Google Ads Services'}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-red flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-800 text-sm leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Card - CTA with Red Gradient */}
          <div 
            className="rounded-2xl shadow-lg p-8 lg:p-10 flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 200, 200, 0.9) 0%, rgba(229, 57, 53, 0.95) 50%, rgba(198, 40, 40, 1) 100%)',
            }}
          >
            <button className="bg-white rounded-xl px-8 py-4 text-brand-red font-bold text-lg lg:text-md hover:bg-gray-50 transition-colors shadow-md">
              {section.ctaButton || 'Start Google Ads Campaign'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10">
            <h3 className="text-xl lg:text-xl font-bold text-gray-900 mb-4">
              {section.block1Title || 'Why Are Google Ads Views Important?'}
            </h3>
            <p className="text-gray-700 leading-relaxed text-base lg:text-md">
              {section.block1Text || 'Google Ads views are derived from actively searching users, ensuring real interactions and engagement. These views help improve your search rankings and increase organic recommendations, making your content more discoverable to your target audience.'}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10">
            <h3 className="text-xl lg:text-xl font-bold text-gray-900 mb-4">
              {section.block2Title || 'Top Reasons to Choose Our Google Services'}
            </h3>
            <p className="text-gray-700 leading-relaxed text-base lg:text-md">
              {section.block2Text || 'Our services use legitimate ad tech to deliver safe traffic. You can target specific high-value regions like USA and Tier-1 countries, ensuring premium traffic that drives conversion and engagement for your campaigns.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
