import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

export default function SocialMediaImpact() {
  const home = useHomeContent();
  const section = home?.socialMediaImpact || {};
  return (
    <section className="bg-white py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(229, 57, 53, 0.15) 0%, rgba(229, 57, 53, 0.08) 40%, transparent 70%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-10 flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div className="w-12 h-0.5 bg-brand-red mb-2" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight" style={{ fontSize: "21px", lineHeight: "1.2" }}>
                {section.leftTitle || 'Maximize Social Media'}{' '}
                <span className="text-brand-red">{section.leftTitleHighlight || 'Impact'}</span>
              </h2>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13px" }}>
                {section.leftParagraph1 || 'YouTube and Google have all become so popular worldwide that gaining widespread visibility and interaction for user-generated content is increasingly difficult.'}
              </p>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13px" }}>
                {section.leftParagraph2 || "When all these users come across channels and accounts or posts with great numbers of subscribers, followers, likes, views, watch hours, and comments respectively, it will increase the interest in what is all the excitement about."}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 lg:p-10 flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div className="w-12 h-0.5 bg-brand-red mb-2" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight" style={{ fontSize: "21px", lineHeight: "1.2" }}>
                {section.rightTitle || 'Boost Organic Profile'}{' '}
                <span className="text-brand-red">{section.rightTitleHighlight || 'Growth'}</span>
              </h2>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13px" }}>
                {section.rightParagraph1 || 'This increases your engagement on YouTube and Google, boosting your influence, popularity, and presence on these platforms.'}
              </p>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: "13px" }}>
                {section.rightParagraph2 || 'YoutubeADwords can make it a reality! With our YouTube and Google engagement packages, results arrive instantly, your account remains secure, and you experience rapid organic growth for your profile, pages, and content!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
