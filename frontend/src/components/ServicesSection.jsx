import React from 'react';
import TrustedPlatformsCarousel from './TrustedPlatformsCarousel';
import { useHomeContent } from '../contexts/ContentContext';

export default function ServicesSection() {
  const home = useHomeContent();
  const section = home?.servicesSection || {};
  const googleServices = section.googleServices || ['Google Ads Video Views', 'Google Display Ads Views', 'Google Discovery Views', 'Google Search Traffic'];
  const tiktokServices = section.tiktokServices || ['TikTok Video Views', 'TikTok Ads Views', 'TikTok Followers', 'TikTok Engagement'];
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* White card: two rows of four buttons */}
        <div className="rounded-2xl bg-white shadow-sm p-6 lg:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap justify-center gap-3">
              {googleServices.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="px-5 py-3 rounded-lg bg-[#4285F4] text-white font-medium text-sm hover:bg-[#3367D6] transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {tiktokServices.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="px-5 py-3 rounded-lg bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Trusted Platforms & Secure Payments carousel */}
        <TrustedPlatformsCarousel />
      </div>
    </section>
  );
}
