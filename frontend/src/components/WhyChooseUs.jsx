import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

const ICONS = [
  <svg key="0" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 12l4-4 4 4 6-6" /></svg>,
  <svg key="1" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>,
  <svg key="2" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  <svg key="3" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
  <svg key="4" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>,
  <svg key="5" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" /></svg>,
  <svg key="6" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 12l4-4 4 4 6-6" /></svg>,
  <svg key="7" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>,
];

const DEFAULT_FEATURES = [
  '100% Growth Guaranteed', 'Turbocharged Delivery', 'Secure Purchase', 'Refill Guaranteed',
  'Real Active Users', 'Long-Term Impact', 'Boost Your Ranking', '24/7 Customer Support',
];

export default function WhyChooseUs() {
  const home = useHomeContent();
  const section = home?.whyChooseUs || {};
  const title = section.title || 'Why Choose Us?';
  const featuresFromContent = section.features || [];
  const featureTitles = featuresFromContent.length ? featuresFromContent.map((f) => (typeof f === 'string' ? f : f.title)) : DEFAULT_FEATURES;
  const features = featureTitles.map((titleText, index) => ({ title: titleText, icon: ICONS[index] || ICONS[0] }));

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-bold text-gray-900 text-center mb-12 lg:mb-16" style={{ fontSize: '21px', lineHeight: '1.2' }}>
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-brand-red hover:border-2 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mb-6 text-brand-red transition-all duration-300 group-hover:scale-110 group-hover:from-red-100 group-hover:to-red-200 group-hover:shadow-lg">
                <div className="transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
              </div>
              <h3 className="font-semibold text-gray-900 leading-tight tracking-tight transition-colors duration-300 group-hover:text-brand-red" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
