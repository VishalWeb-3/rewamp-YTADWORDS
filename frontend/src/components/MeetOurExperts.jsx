import React from 'react';
import { useHomeContent } from '../contexts/ContentContext';

const DEFAULT_EXPERTS = [
  { name: 'ALEXANDER STERLING', role: 'Ads Strategy Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&q=80', description: 'Develops comprehensive Google Ads campaigns. He helps clients maximize ROI through strategic ad placement and targeting.' },
  { name: 'ELEANOR VANCE', role: 'Growth Marketing', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&q=80', description: 'Oversees operations and ensures smooth service delivery. She coordinates teams to deliver exceptional results for every client.' },
  { name: 'NATHANIEL DRAKE', role: 'Tech & Analytics', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&q=80', description: 'Analyzes performance data and optimizes campaigns. He uses advanced analytics to track growth and improve engagement metrics.' },
  { name: 'ISABELLA ROSS', role: 'Content Strategist', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&q=80', description: 'Guides clients on content optimization. She helps you understand what type of content goes viral and how to retain viewers.' },
  { name: 'CHARLOTTE HALE', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&q=80', description: 'Ensures client satisfaction and provides ongoing support. She helps creators achieve their goals with personalized guidance.' },
];

export default function MeetOurExperts() {
  const home = useHomeContent();
  const section = home?.meetOurExperts || {};
  const experts = section.experts?.length ? section.experts : DEFAULT_EXPERTS;
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4">
          {section.title || 'Meet Our'}{' '}
          <span className="text-brand-red">{section.titleHighlight || 'Experts'}</span>
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center text-base lg:text-lg max-w-2xl mx-auto mb-12 lg:mb-16">
          {section.subtitle || 'Our team of certified professionals is dedicated to growing your social media presence safely and organically.'}
        </p>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {experts.map((expert, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Image with grayscale filter */}
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                
                {/* Default gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-opacity duration-300" />
                
                {/* Red overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-red/80 via-brand-red/60 to-brand-red/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Description text - slides up from bottom on hover */}
                <div className="absolute inset-0 flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10">
                  <p className="text-white text-sm lg:text-sm leading-relaxed text-center font-medium mb-16">
                    {expert.description}
                  </p>
                </div>
                
                {/* Name and Role - always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <h3 className="text-white font-bold text-sm lg:text-base mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-white/90 text-xs lg:text-sm">
                    {expert.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
