import React from 'react';

const testimonials = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    category: 'YT Creator',
    rating: '4.9',
    quote: 'The Google Ads strategy is fantastic. It\'s motivating to see my subscriber count grow with real people. YouTube Ad Words has a great mix of safety and speed.',
    name: 'Caleb Sterling',
    handle: '@caleb_tech_reviews',
    highlighted: true,
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
    category: 'TikToker',
    rating: '4.8',
    quote: 'Finally a service that doesn\'t use bots. My engagement on TikTok videos skyrocketed within 24 hours. The support team helped me choose the right package.',
    name: 'Chloe Vance',
    handle: '@chloe_vibe_official',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18" />
        <path d="M5 21V7l8-4v18" />
        <path d="M19 21V11l-6-4" />
        <path d="M9 9v0" />
        <path d="M9 12v0" />
        <path d="M9 15v0" />
        <path d="M9 18v0" />
      </svg>
    ),
    category: 'Agency',
    rating: '5.0',
    quote: 'We manage 10+ channels and use YouTube Ad Words for the initial push. The retention rate is amazing compared to other panels. Highly recommended!',
    name: 'Marcus Thorne',
    handle: 'Thorne Digital Media',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    category: 'Musician',
    rating: '4.7',
    quote: 'Used the \'Watch Hours\' service to get my music channel monetized. It took about 2 weeks but the delivery was steady and safe. Thanks team!',
    name: 'Jaxson Reed',
    handle: '@jaxson_beats',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    category: 'Influencer',
    rating: '4.9',
    quote: 'I was skeptical about buying likes, but these look real. No sudden drops, and it helped my reel go viral on the Explore page. Will buy again.',
    name: 'Elena Brooks',
    handle: '@elena_style_nyc',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 12h4m-2-2v4" />
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M14 10h.01M18 10h.01" />
      </svg>
    ),
    category: 'Gamer',
    rating: '4.8',
    quote: 'Great service for live streamers. The concurrent viewers package helped me rank higher in the gaming category. Stable and reliable.',
    name: 'Tyler Frost',
    handle: '@frost_gaming_live',
  },
];

export default function TrustedClients() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Our Trusted{' '}
            <span className="bg-brand-red text-white px-4 py-1 rounded-full inline-block">
              Clients
            </span>
          </h2>
          <p className="text-gray-500 text-base lg:text-lg max-w-2xl mx-auto">
            Our mission is to drive progress and enhance the careers of creators by delivering superior Google Ads strategies that exceed expectations.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-md p-6 lg:p-8 flex flex-col transition-transform duration-300 ${
                testimonial.highlighted
                  ? 'border-2 border-brand-red -rotate-[5deg]'
                  : 'border border-transparent'
              }`}
            >
              {/* Icon and Category */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-gray-800">
                  {testimonial.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{testimonial.category}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-brand-red font-bold">{testimonial.rating}</span>
                    <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic text-sm lg:text-base leading-relaxed mb-6 flex-1">
                "{testimonial.quote}"
              </p>

              {/* Client Info */}
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
