import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { usePricingPackages } from '../contexts/ContentContext';

const followerPackagesFallback = {
  regular: [
    { followers: '50', price: '1.67', originalPrice: '1.85', discount: '10%' },
    { followers: '100', price: '3.51', originalPrice: '3.90', discount: '10%' },
    { followers: '250', price: '8.55', originalPrice: '9.50', discount: '10%' },
    { followers: '500', price: '15.21', originalPrice: '16.90', discount: '10%' },
    { followers: '1K', price: '27.90', originalPrice: '31.00', discount: '10%' },
    { followers: '2.5K', price: '42.30', originalPrice: '47.00', discount: '10%' },
    { followers: '5.0K', price: '85.50', originalPrice: '95.00', discount: '10%' },
    { followers: '10.0K', price: '166.50', originalPrice: '185.00', discount: '10%' },
    { followers: '50.0K', price: '808.20', originalPrice: '898.00', discount: '10%' },
  ],
};

const features = [
  { label: 'Real & Organic Followers', icon: 'check' },
  { label: 'High Quality', icon: 'check' },
  { label: 'Instant start', icon: 'check' },
  { label: 'Refill Guaranteed', icon: 'check' },
  { label: 'No drops', icon: 'check' },
  { label: 'Privacy and safety', icon: 'check' },
];

export default function BuyTikTokFollowersPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const followerPackages = usePricingPackages('buy-tiktok-followers', followerPackagesFallback);
  const [activeTab, setActiveTab] = useState('regular');
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
  const packages = followerPackages ? followerPackages[activeTab] : [];

  const handleAddToCart = (pkg) => {
    addToCart({
      platform: 'TikTok',
      serviceType: 'TikTok Followers',
      serviceName: `TikTok Followers - ${pkg.followers}`,
      type: 'High Quality',
      quantity: pkg.followers,
      price: pkg.price,
      followers: pkg.followers,
    });
  };

  const faqs = [
    {
      question: 'How quickly will I receive my TikTok followers?',
      answer: 'Delivery times vary depending on the package you choose. Regular followers typically start within a few hours, while Fast Followers begin immediately. All packages are designed to deliver followers gradually to ensure natural growth patterns.',
    },
    {
      question: 'Are the followers real and from real users?',
      answer: 'Yes! YoutubeADwords provides authentic followers from real users. Our followers come from organic discovery methods, ensuring they appear genuine and natural.',
    },
    {
      question: 'Will buying followers get my account banned?',
      answer: 'No, our service is completely safe. We use legitimate methods that comply with TikTok\'s terms of service.',
    },
    {
      question: 'Can I choose which country the followers come from?',
      answer: 'Yes! Our system automatically analyzes your account and suggests the most suitable country for your target audience.',
    },
    {
      question: 'What happens if followers drop after delivery?',
      answer: 'We offer a refill guarantee on all our packages. If you experience any drops in followers, we will refill them at no additional cost.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <Layout>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/30 transform -rotate-12 -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 transform rotate-12 -translate-x-32 translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            <div className="mb-6 flex justify-center">
              <img src="/pricepage.png" alt="Buy TikTok Followers" className="w-[200px] h-auto object-cover bg-transparent" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
                Buy TikTok Followers <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">Instantly</span>
              </h1>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                YoutubeADwords is the safest way to buy TikTok Followers with delivery in just a few minutes. We offer multiple packages with real users for all different needs - choose wisely!
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {[{ id: 'regular', label: 'High Quality' }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedPackageIndex(null); }}
                  className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${activeTab === tab.id ? 'text-gray-900 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {packages.map((pkg, index) => {
                const isSelected = selectedPackageIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPackageIndex(index)}
                    className={`rounded-full transition-colors cursor-pointer flex items-center ${isSelected ? 'bg-blue-600 p-[2px]' : 'bg-gray-50 hover:border-blue-600/50 p-0'}`}
                  >
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] bg-white flex-shrink-0 ${isSelected ? 'border-2 border-blue-600 border-r-0 rounded-l-full' : 'rounded-l-full'}`}>
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">{pkg.followers}</div>
                      <div className="text-xs text-gray-500 mt-0.5">followers</div>
                    </div>
                    <div className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center rounded-r-full ${isSelected ? 'bg-blue-600' : ''}`}>
                      {pkg.originalPrice ? (
                        <>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 mb-1">
                            <span className={`line-through text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-gray-400'}`}>${pkg.originalPrice}</span>
                            <span className={`font-bold text-base sm:text-lg ${isSelected ? 'text-white' : 'text-blue-600'}`}>${pkg.price}</span>
                          </div>
                          <div className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${isSelected ? 'bg-black text-white' : 'bg-blue-600 text-white'}`}>save {pkg.discount}</div>
                        </>
                      ) : (
                        <div className={`font-bold text-base sm:text-xl ${isSelected ? 'text-white' : 'text-gray-900'}`}>${pkg.price}</div>
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
                    const selectedPkg = packages[selectedPackageIndex];
                    navigate('/get-started', {
                      state: {
                        allPackages: followerPackages,
                        serviceType: 'TikTok Followers',
                        typeLabels: { regular: 'High Quality' },
                        quantityKey: 'followers',
                        unitLabel: 'followers',
                        initialType: activeTab,
                        initialPackage: selectedPkg,
                      },
                    });
                  }
                }}
                disabled={selectedPackageIndex === null}
                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Buy now
              </button>
              <button
                onClick={() => { if (selectedPackageIndex !== null) handleAddToCart(packages[selectedPackageIndex]); }}
                disabled={selectedPackageIndex === null}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add to cart
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  <span className="text-gray-700 text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">Frequently Asked <span className="text-blue-600 relative">Questions<span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" /></span></h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => toggleFAQ(index)}>
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4 flex-1">{faq.question}</h3>
                    <div className="flex-shrink-0">{openFAQIndex === index ? <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg> : <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}</div>
                  </div>
                  {openFAQIndex === index && <div className="px-6 pb-6 pt-0"><p className="text-gray-600 leading-relaxed text-base">{faq.answer}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
