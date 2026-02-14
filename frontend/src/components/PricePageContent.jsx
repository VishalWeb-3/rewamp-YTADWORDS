import React, { useState } from 'react';
import { usePricePage } from '../contexts/ContentContext';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../hooks/useCheckout';

const defaultTabs = [
  { id: 'regular', label: 'Regular' },
  { id: 'fast', label: 'Fast' },
  { id: 'ads', label: 'Ads' },
];

const defaultFeatures = [
  { label: 'Real & Organic' },
  { label: 'High Quality' },
  { label: 'Instant start' },
  { label: 'Refill Guaranteed' },
  { label: 'No drops' },
  { label: 'Privacy and safety' },
];

/** Renders the hero + pricing card (and optional all-in-one) from content/prices. Use as the top of each Buy* page. */
export default function PricePageContent({ slug, platform, fallbackPackages, fallbackTitle, fallbackUnit, children }) {
  const { page, packages: packagesByTab } = usePricePage(slug);
  const { addToCart } = useCart();
  const { goToCheckout } = useCheckout();
  const [activeTab, setActiveTab] = useState('regular');
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);

  const packages = (packagesByTab && packagesByTab[activeTab]) || (fallbackPackages && fallbackPackages[activeTab]) || [];
  const tabs = page?.tabs ?? defaultTabs;
  const features = page?.features ?? defaultFeatures;
  const qtyKey = page?.quantityKey ?? fallbackUnit ?? 'views';
  const qtyUnit = page?.quantityUnit ?? fallbackUnit ?? 'views';
  const title = page?.title ?? fallbackTitle ?? '';

  const handleAddToCart = (pkg) => {
    const qty = pkg.quantity ?? pkg.views ?? pkg.followers ?? pkg.likes ?? pkg.subscribers;
    addToCart({
      platform: platform || 'YouTube',
      serviceType: title,
      serviceName: `${title} - ${qty}`,
      type: tabs.find((t) => t.id === activeTab)?.label ?? 'Regular',
      quantity: qty,
      price: pkg.price,
      [qtyKey]: qty,
    });
  };

  const handleCheckout = (pkg) => {
    const qty = pkg.quantity ?? pkg.views ?? pkg.followers ?? pkg.likes ?? pkg.subscribers;
    goToCheckout({ ...pkg, [qtyKey]: qty, quantity: qty }, platform || 'YouTube', `${title} - ${qty}`, qtyKey);
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-6">
          <div className="mb-6 flex justify-center">
            <img
              src={page?.imageSrc ?? '/pricepage.png'}
              alt={page?.imageAlt ?? title}
              className="w-[200px] h-auto object-cover bg-transparent"
            />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
              {title}{' '}
              <span className="bg-brand-red text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                {page?.titleHighlight ?? 'Instantly'}
              </span>
            </h1>
            {page?.subtitle && (
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">{page.subtitle}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedPackageIndex(null);
                }}
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

          {page?.infoBanner && (
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Information:</span> {page.infoBanner}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            {packages.map((pkg, index) => {
              const isSelected = selectedPackageIndex === index;
              const qty = pkg.quantity ?? pkg.views ?? pkg.followers ?? pkg.likes ?? pkg.subscribers;
              return (
                <div
                  key={index}
                  onClick={() => setSelectedPackageIndex(index)}
                  className={`rounded-full transition-colors cursor-pointer flex items-center ${
                    isSelected ? 'bg-brand-red p-[2px]' : 'bg-gray-50 hover:border-brand-red/50 p-0'
                  }`}
                >
                  <div
                    className={`px-4 py-3 flex flex-col items-center justify-center min-w-[100px] bg-white ${
                      isSelected ? 'border-2 border-brand-red border-r-0 rounded-l-full' : 'rounded-l-full'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900">{qty}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{qtyUnit}</div>
                  </div>
                  <div
                    className={`flex-1 px-4 py-3 flex flex-col items-center justify-center rounded-r-full ${
                      isSelected ? 'bg-brand-red' : ''
                    }`}
                  >
                    {pkg.originalPrice ? (
                      <>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span
                            className={`line-through text-sm ${
                              isSelected ? 'text-white' : 'text-gray-400'
                            }`}
                          >
                            ${pkg.originalPrice}
                          </span>
                          <span
                            className={`font-bold text-lg ${
                              isSelected ? 'text-white' : 'text-brand-red'
                            }`}
                          >
                            ${pkg.price}
                          </span>
                        </div>
                        <div
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            isSelected ? 'bg-black text-white' : 'bg-brand-red text-white'
                          }`}
                        >
                          save {pkg.discount}
                        </div>
                      </>
                    ) : (
                      <div
                        className={`font-bold text-xl ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        ${pkg.price}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => {
                if (selectedPackageIndex !== null) {
                  handleCheckout(packages[selectedPackageIndex]);
                }
              }}
              disabled={selectedPackageIndex === null}
              className="flex-1 bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-[#C62828] transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              {page?.buyNowLabel ?? 'Buy now'}
            </button>
            <button
              onClick={() => {
                if (selectedPackageIndex !== null) {
                  handleAddToCart(packages[selectedPackageIndex]);
                }
              }}
              disabled={selectedPackageIndex === null}
              className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              {page?.addToCartLabel ?? 'Add to cart'}
            </button>
          </div>

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

      {page?.allInOnePrice && page?.allInOneTitle && (
        <div className="mt-12 lg:mt-16">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-100/40 transform rotate-12 -translate-x-8 translate-y-8" />
            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">{page.allInOneTitle}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-brand-red text-white font-bold px-6 py-3 rounded-full text-lg">
                    ${page.allInOnePrice}
                  </div>
                  <button
                    onClick={() => {
                      const pkg = { quantity: '5000', price: page.allInOnePrice };
                      goToCheckout(
                        { ...pkg, [qtyKey]: '5000' },
                        platform || 'YouTube',
                        page.allInOneTitle,
                        qtyKey
                      );
                    }}
                    className="bg-gray-900 text-white font-bold px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition-colors"
                  >
                    {page.allInOneButtonLabel ?? 'Buy now'}
                  </button>
                </div>
                {page.allInOneDescription && (
                  <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                    {page.allInOneDescription}
                  </p>
                )}
              </div>
              {page.allInOneFeatures && page.allInOneFeatures.length > 0 && (
                <div className="grid grid-cols-2 gap-6">
                  {page.allInOneFeatures.map((f, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl lg:text-5xl font-bold text-brand-red mb-2">
                        {f.value}
                      </div>
                      <div className="text-gray-700 text-sm lg:text-base">{f.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
