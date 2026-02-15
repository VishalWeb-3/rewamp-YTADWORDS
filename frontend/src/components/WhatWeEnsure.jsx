import React, { useState } from 'react';
import { useHomeContent } from '../contexts/ContentContext';

const DEFAULT_CARDS = [
  { id: 1, title: 'Authentic, Lasting Engagement', description: 'We deliver quality user interactions for YouTube and TikTok. Our services focus on genuine growth and protection against penalties.', bgColor: 'bg-red-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    defaultZ: 10,
    rotation: '-rotate-2',
    position: 'left',
  },
  {
    id: 2,
    title: 'Commitment to Data Safety',
    description: 'We are committed to data security. Our advanced encrypted servers and strict policy of never asking for sensitive social media passwords ensure 100% confidentiality.',
    bgColor: 'bg-purple-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    defaultZ: 30,
    rotation: 'rotate-1',
    position: 'center',
  },
  {
    id: 3,
    title: 'Exceptional Customer Experience',
    description: 'We prioritize client satisfaction with instant campaign start, diverse packages, and 24/7 expert support. Your success is our mission.',
    bgColor: 'bg-blue-600',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    ),
    defaultZ: 20,
    rotation: 'rotate-2',
    position: 'right',
  },
];

export default function WhatWeEnsure() {
  const home = useHomeContent();
  const section = home?.whatWeEnsure || {};
  const contentCards = section.cards;
  const cards = contentCards?.length
    ? contentCards.map((c, i) => ({ ...DEFAULT_CARDS[i], title: c.title, description: c.description }))
    : DEFAULT_CARDS;
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="bg-white py-16 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-center mb-12 lg:mb-16">
          {section.title || 'What We'}{' '}
          <span className="text-brand-red relative inline-block">
            {section.titleHighlight || 'Ensure'}
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-brand-red" />
          </span>
        </h2>

        {/* Cards Container - stacked on mobile, overlapping on desktop */}
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0 min-h-0 lg:min-h-[540px] py-4 lg:py-0 px-2 sm:px-0">
          {cards.map((card, index) => {
            const isHovered = hoveredCard === card.id;
            const zIndex = isHovered ? 50 : card.defaultZ;
            
            const cardWidthDesktop = 384;
            const overlapDesktop = cardWidthDesktop * 0.1;
            const offsetDesktop = (index * (cardWidthDesktop - overlapDesktop)) - ((cards.length - 1) * (cardWidthDesktop - overlapDesktop)) / 2;
            
            const rotationValue = card.rotation === '-rotate-2' ? '-2deg' : card.rotation === 'rotate-2' ? '2deg' : '1deg';
            const scaleValue = isHovered ? 1.05 : 1;
            
            return (
              <div
                key={card.id}
                className="w-full max-w-[336px] lg:max-w-none lg:absolute transition-all duration-300 ease-out ensure-card-mobile lg:ensure-card"
                style={{ 
                  zIndex,
                  '--offset-desktop': `${offsetDesktop}px`,
                  '--rotation': rotationValue,
                  '--scale': scaleValue,
                }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`${card.bgColor} rounded-2xl p-6 sm:p-7 lg:p-10 shadow-xl w-full lg:w-[384px] cursor-pointer`}
                >
                  {/* Icon */}
                  <div className="flex justify-end mb-5">
                    <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white">
                      {card.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-xl lg:text-2xl mb-4">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                    {card.id === 2 ? (
                      <>
                        We are committed to data security. Our advanced encrypted servers and strict policy of <strong>never</strong> asking for sensitive social media passwords ensure 100% confidentiality.
                      </>
                    ) : (
                      card.description
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
