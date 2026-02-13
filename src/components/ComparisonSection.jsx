import React from 'react';

const otherProvidersPoints = [
  'Uses cheap bot scripts & proxies',
  'High drop rate (Views disappear)',
  'Risks account flagging or bans',
  'No customer support available',
  'Generic, fake-looking profiles',
];

const youtubeAdWordsPoints = [
  'Real Traffic via Google Ads Strategies',
  'Non-Drop Lifetime Guarantee',
  '100% Safe & Policy Compliant',
  '24/7 Expert WhatsApp/Chat Support',
  'High-Retention (Sticky) Engagement',
];

export default function ComparisonSection() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Main Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
          Why We Are{' '}
          <span className="text-brand-red">Better?</span>
        </h2>

        {/* Comparison Cards */}
        <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Card - Other Providers */}
          <div className="bg-gray-100 rounded-2xl shadow-lg p-8 lg:p-10 flex-1 w-full lg:w-auto">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800 text-center mb-6">
              Other Providers
            </h3>
            <ul className="space-y-4">
              {otherProvidersPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm lg:text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* VS Icon - Overlapping both cards */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-black border-4 border-white flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-lg lg:text-xl">VS</span>
          </div>

          {/* Right Card - YouTube Ad Words */}
          <div className="bg-white rounded-2xl border-2 border-brand-red p-8 lg:p-10 flex-1 w-full lg:w-auto relative">
            {/* BEST CHOICE Label */}
            <div className="absolute -top-3 -right-3 bg-brand-red rounded-full px-4 py-1.5 shadow-lg z-20">
              <span className="text-white text-xs font-bold uppercase tracking-wide">BEST CHOICE</span>
            </div>

            {/* Red Radial Gradient Shadow */}
            <div 
              className="absolute inset-0 rounded-2xl -z-10 blur-xl opacity-60"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(229, 57, 53, 0.4) 0%, rgba(229, 57, 53, 0.2) 50%, transparent 100%)',
                transform: 'scale(1.1)',
              }}
            />

            <h3 className="text-xl lg:text-2xl font-bold text-center mb-6">
              <span className="text-gray-800">YouTube</span>{' '}
              <span className="text-brand-red">Ad Words</span>
            </h3>
            <ul className="space-y-4">
              {youtubeAdWordsPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm lg:text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
