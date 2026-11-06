import React from 'react';

const partners = [
  { name: 'Visa', type: 'payment' },
  { name: 'McAfee', type: 'security' },
  { name: 'YouTube | Certified', type: 'platform', icon: 'youtube' },
  { name: 'Google Partner', type: 'platform', icon: 'google' },
  { name: 'PayPal', type: 'payment' },
];

function LogoItem({ item }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center justify-center gap-1 px-6 py-3 grayscale hover:grayscale-0 transition-all min-w-[100px]">
      {item.icon === 'youtube' && (
        <>
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{item.name}</span>
        </>
      )}
      {item.icon === 'google' && (
        <>
          <span className="flex items-center justify-center w-12 h-12 rounded border border-gray-400 text-gray-600 font-bold text-lg">G</span>
          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{item.name}</span>
        </>
      )}
      {item.type === 'payment' && (
        <span className="flex items-center justify-center w-12 h-12 text-sm font-semibold text-gray-500 uppercase tracking-wider">{item.name}</span>
      )}
      {item.name === 'McAfee' && (
        <span className="flex items-center justify-center w-12 h-12 text-sm font-semibold text-gray-500">{item.name}</span>
      )}
    </div>
  );
}

export default function TrustedPlatformsCarousel() {
  // Multiple copies for seamless infinite scroll (loop at 50% = one set width)
  const duplicated = [...partners, ...partners, ...partners, ...partners];

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white py-8 px-6 lg:px-10">
      <h3 className="text-center text-gray-700 font-serif font-semibold uppercase tracking-wide mb-8 text-sm md:text-base">
        Trusted{' '}
        <span className="relative inline-block">
          Platforms
          <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-brand-red" />
        </span>
        {' '}& Secure Payments
      </h3>
      <div className="relative overflow-hidden">
        <div className="flex gap-8 w-max will-change-transform animate-marquee">
          {duplicated.map((item, i) => (
            <LogoItem key={`${item.name}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
