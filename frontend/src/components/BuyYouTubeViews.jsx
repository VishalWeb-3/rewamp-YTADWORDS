import React, { useState } from 'react';

const viewPackages = {
  regular: [
    { views: '100', price: '1.49', originalPrice: null, discount: null },
    { views: '1.0k', price: '10.90', originalPrice: '16.00', discount: '32%' },
    { views: '2.5k', price: '24.90', originalPrice: '37.00', discount: '33%' },
    { views: '5.0k', price: '44.90', originalPrice: '67.00', discount: '33%' },
  ],
  fast: [
    { views: '100', price: '2.49', originalPrice: null, discount: null },
    { views: '1.0k', price: '19.90', originalPrice: '29.00', discount: '31%' },
    { views: '2.5k', price: '44.90', originalPrice: '67.00', discount: '33%' },
    { views: '5.0k', price: '79.90', originalPrice: '120.00', discount: '33%' },
  ],
  ads: [
    { views: '100', price: '3.49', originalPrice: null, discount: null },
    { views: '1.0k', price: '29.90', originalPrice: '45.00', discount: '33%' },
    { views: '2.5k', price: '69.90', originalPrice: '105.00', discount: '33%' },
    { views: '5.0k', price: '129.90', originalPrice: '195.00', discount: '33%' },
  ],
};

const features = [
  { label: 'Real & Organic Views', icon: 'check' },
  { label: 'High Quality', icon: 'check' },
  { label: 'Instant start', icon: 'check' },
  { label: 'Refill Guaranteed', icon: 'check' },
  { label: 'No drops', icon: 'check' },
  { label: 'Privacy and safety', icon: 'check' },
];

export default function BuyYouTubeViews() {
  const [activeTab, setActiveTab] = useState('regular');
  const packages = viewPackages[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Background decorative shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/30 transform -rotate-12 -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 transform rotate-12 -translate-x-32 translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section - Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
                Buy YouTube Views{' '}
                <span className="bg-brand-red text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                  Instantly
                </span>
              </h1>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Views4You is the safest way to buy YouTube Views with delivery in just a few minutes. We offer multiple packages with real users for all different needs - choose wisely!
              </p>
            </div>
          </div>

          {/* Right Section - Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {[
                { id: 'regular', label: 'Regular Views' },
                { id: 'fast', label: 'Fast Views' },
                { id: 'ads', label: 'Ads Views' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-brand-red'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Information Banner */}
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Information:</span> We recommend our{' '}
                <span className="text-brand-red font-semibold">Fast YouTube Views</span> packages for orders with a high number of views.
              </p>
            </div>

            {/* View Packages Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-brand-red/50 transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {pkg.views} views
                    </div>
                    <div className="space-y-1">
                      {pkg.originalPrice ? (
                        <>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-gray-400 line-through text-sm">
                              ${pkg.originalPrice}
                            </span>
                            <span className="text-brand-red font-bold text-lg">
                              ${pkg.price}
                            </span>
                          </div>
                          <div className="bg-brand-red text-white text-xs font-bold px-2 py-1 rounded inline-block">
                            save {pkg.discount}
                          </div>
                        </>
                      ) : (
                        <div className="text-brand-red font-bold text-xl">
                          ${pkg.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Buy Now Button */}
            <button className="w-full bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-[#C62828] transition-colors text-lg mb-6 shadow-lg">
              Buy now
            </button>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-brand-red flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
