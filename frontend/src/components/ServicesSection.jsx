import React from 'react';
import { Link } from 'react-router-dom';
import TrustedPlatformsCarousel from './TrustedPlatformsCarousel';
import { useHomeContent } from '../contexts/ContentContext';

export default function ServicesSection() {
  const home = useHomeContent();
  const section = home?.servicesSection || {};
  const googleServices = section.googleServices || [];

  const getServiceLink = (label) => {
    const l = label.toLowerCase();
    if (l.includes('youtube')) return '/buy-youtube-views';
    if (l.includes('google ads')) return '/buy-google-skip-ads-views';
    return '#';
  };

  const getServiceColor = (label) => {
    const l = label.toLowerCase();
    if (l.includes('youtube')) return 'bg-[#FF0000] hover:bg-[#CC0000]';
    if (l.includes('google ads')) return 'bg-[#4285F4] hover:bg-[#3367D6]';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const allServices = googleServices;

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        {/* Buttons in a single horizontal row on larger screens */}
        <div className="rounded-2xl bg-white shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-6">
            {allServices.slice(0, 4).map((label) => (
              <Link
                key={label}
                to={getServiceLink(label)}
                className={`w-full sm:w-auto text-center px-4 md:px-8 py-3.5 rounded-xl text-white font-black text-sm md:text-base transition-all transform hover:scale-105 shadow-lg whitespace-nowrap ${getServiceColor(label)}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Trusted Platforms & Secure Payments carousel */}
        <TrustedPlatformsCarousel />
      </div>
    </section>
  );
}
