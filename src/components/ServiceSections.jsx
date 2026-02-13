import React from 'react';

// Service Card Component
function ServiceCard({ subtitle, benefits, buttonText, theme = 'red', cardPosition = 'left' }) {
  const isBlue = theme === 'blue';
  const isGreen = theme === 'green';
  const brandColor = isBlue ? '#2563EB' : isGreen ? '#22C55E' : '#E53935';
  const gradientStart = isBlue ? 'rgba(200, 220, 255, 0.9)' : isGreen ? 'rgba(200, 255, 220, 0.9)' : 'rgba(255, 200, 200, 0.9)';
  const gradientMid = isBlue ? 'rgba(37, 99, 235, 0.95)' : isGreen ? 'rgba(34, 197, 94, 0.95)' : 'rgba(229, 57, 53, 0.95)';
  const gradientEnd = isBlue ? 'rgba(30, 64, 175, 1)' : isGreen ? 'rgba(21, 128, 61, 1)' : 'rgba(198, 40, 40, 1)';
  const titleText = subtitle.replace('Buy ', '').replace(' Services', '');

  return (
    <section className="bg-gray-50 py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title and Subtitle */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Our Premium Advertising Solutions
          </h2>
          <div className="w-16 h-0.5 mx-auto mb-4" style={{ backgroundColor: brandColor }} />
          <h3 className="text-2xl lg:text-3xl font-bold" style={{ color: brandColor }}>
            {subtitle}
          </h3>
        </div>

        {/* Two Cards Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Benefits Card - Position alternates */}
          {cardPosition === 'left' ? (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: brandColor }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-800 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div 
                className="rounded-2xl shadow-lg p-8 lg:p-10 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at center, ${gradientStart} 0%, ${gradientMid} 50%, ${gradientEnd} 100%)`,
                }}
              >
                <button className="bg-white rounded-xl px-8 py-4 font-bold text-lg lg:text-md hover:bg-gray-50 transition-colors shadow-md" style={{ color: brandColor }}>
                  {buttonText}
                </button>
              </div>
            </>
          ) : (
            <>
              <div 
                className="rounded-2xl shadow-lg p-8 lg:p-10 flex items-center justify-center relative overflow-hidden"
                style={{
                  background: `radial-gradient(ellipse at center, ${gradientStart} 0%, ${gradientMid} 50%, ${gradientEnd} 100%)`,
                }}
              >
                <button className="bg-white rounded-xl px-8 py-4 font-bold text-lg lg:text-md hover:bg-gray-50 transition-colors shadow-md" style={{ color: brandColor }}>
                  {buttonText}
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: brandColor }}>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-800 text-sm leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Two Text Blocks Below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10">
            <h3 className="text-xl lg:text-xl font-bold text-gray-900 mb-4">
              Why Are {titleText} Important?
            </h3>
            <p className="text-gray-700 leading-relaxed text-base lg:text-md">
              {titleText} help improve your visibility and engagement on the platform. These authentic interactions boost your credibility and help you reach a wider audience, making your content more discoverable to your target market.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-8 lg:p-10">
            <h3 className="text-xl lg:text-xl font-bold text-gray-900 mb-4">
              Top Reasons to Choose Our Services
            </h3>
            <p className="text-gray-700 leading-relaxed text-base lg:text-md">
              Our services use legitimate methods to deliver safe and authentic results. You can target specific high-value regions, ensuring premium quality that drives real engagement and growth for your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Benefits data
const tiktokAdsBenefits = [
  'Genuine views delivered via TikTok Ads networks',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Includes Video Ads, In-Feed, and Spark Ads traffic',
  'Scalable packages (Minimum 500 up to 500k+)',
  '100% Manual verification & WhatsApp support',
];

const tiktokFollowersBenefits = [
  'Real followers from active TikTok users',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Organic growth with authentic engagement',
  'Scalable packages (Minimum 100 up to 100k+)',
  '100% Manual verification & WhatsApp support',
];

const tiktokLikesBenefits = [
  'Genuine likes from real TikTok users',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Boosts video visibility and engagement',
  'Scalable packages (Minimum 500 up to 500k+)',
  '100% Manual verification & WhatsApp support',
];

const youtubeViewsBenefits = [
  'Genuine views delivered via YouTube networks',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Includes organic and promoted video views',
  'Scalable packages (Minimum 1k up to 1M+)',
  '100% Manual verification & WhatsApp support',
];

const youtubeSubscribersBenefits = [
  'Real subscribers from active YouTube users',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Organic growth with authentic engagement',
  'Scalable packages (Minimum 100 up to 100k+)',
  '100% Manual verification & WhatsApp support',
];

const youtubeLikesBenefits = [
  'Genuine likes from real YouTube viewers',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Boosts video visibility and recommendations',
  'Scalable packages (Minimum 500 up to 500k+)',
  '100% Manual verification & WhatsApp support',
];

const youtubeWatchHoursBenefits = [
  'Authentic watch hours from engaged viewers',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Helps meet YouTube monetization requirements',
  'Scalable packages (Minimum 1k up to 100k+)',
  '100% Manual verification & WhatsApp support',
];

const googleReviewsBenefits = [
  'Authentic reviews from verified Google users',
  'Target Worldwide, USA, India, or Tier-1 Countries',
  'Improves local SEO and business credibility',
  'Scalable packages (Minimum 10 up to 1k+)',
  '100% Manual verification & WhatsApp support',
];

export default function ServiceSections() {
  return (
    <>
      {/* Row 1: 4 sections */}
      <ServiceCard
        subtitle="Buy TikTok Ads Services"
        benefits={tiktokAdsBenefits}
        buttonText="Start TikTok Ads Campaign"
        theme="blue"
        cardPosition="left"
      />
      <ServiceCard
        subtitle="Buy TikTok Followers"
        benefits={tiktokFollowersBenefits}
        buttonText="Start TikTok Followers Campaign"
        theme="blue"
        cardPosition="right"
      />
      <ServiceCard
        subtitle="Buy TikTok Likes"
        benefits={tiktokLikesBenefits}
        buttonText="Start TikTok Likes Campaign"
        theme="blue"
        cardPosition="left"
      />
      <ServiceCard
        subtitle="Buy YouTube Views"
        benefits={youtubeViewsBenefits}
        buttonText="Start YouTube Views Campaign"
        theme="red"
        cardPosition="right"
      />

      {/* Row 2: 4 sections */}
      <ServiceCard
        subtitle="Buy YouTube Subscribers"
        benefits={youtubeSubscribersBenefits}
        buttonText="Start YouTube Subscribers Campaign"
        theme="red"
        cardPosition="left"
      />
      <ServiceCard
        subtitle="Buy YouTube Likes"
        benefits={youtubeLikesBenefits}
        buttonText="Start YouTube Likes Campaign"
        theme="red"
        cardPosition="right"
      />
      <ServiceCard
        subtitle="Buy YouTube Watch Hours"
        benefits={youtubeWatchHoursBenefits}
        buttonText="Start YouTube Watch Hours Campaign"
        theme="red"
        cardPosition="left"
      />
      <ServiceCard
        subtitle="Buy Google Reviews"
        benefits={googleReviewsBenefits}
        buttonText="Start Google Reviews Campaign"
        theme="green"
        cardPosition="right"
      />
    </>
  );
}
