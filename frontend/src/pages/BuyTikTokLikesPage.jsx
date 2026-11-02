import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { usePricingPackages, usePricingPageContent } from '../contexts/ContentContext';
import { resolveImageUrl } from '../utils/image';
import ServiceAssurance from '../components/ServiceAssurance';

const likePackagesFallback = {
  regular: [
    { likes: '50', price: '1.22', originalPrice: '1.35', discount: '10%' },
    { likes: '100', price: '2.39', originalPrice: '2.65', discount: '10%' },
    { likes: '250', price: '4.01', originalPrice: '4.45', discount: '10%' },
    { likes: '500', price: '6.44', originalPrice: '7.15', discount: '10%' },
    { likes: '1K', price: '10.49', originalPrice: '11.65', discount: '10%' },
    { likes: '2.5K', price: '23.45', originalPrice: '26.05', discount: '10%' },
    { likes: '5.0K', price: '40.46', originalPrice: '44.95', discount: '10%' },
    { likes: '10.0K', price: '72.05', originalPrice: '80.05', discount: '10%' },
    { likes: '25.0K', price: '153.00', originalPrice: '170.00', discount: '10%' },
    { likes: '50.0K', price: '304.88', originalPrice: '338.75', discount: '10%' },
  ],
};

export default function BuyTikTokLikesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const likePackages = usePricingPackages('buy-tiktok-likes', likePackagesFallback);
  const content = usePricingPageContent('buy-tiktok-likes', null);
  const [activeTab, setActiveTab] = useState('regular');
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
  const packages = likePackages ? likePackages[activeTab] : [];

  const hero = content?.hero;
  const features = (content?.features?.length ? content.features : [
    { label: 'Real & Organic Likes', icon: 'check' },
    { label: 'High Quality', icon: 'check' },
    { label: 'Instant start', icon: 'check' },
    { label: 'Refill Guaranteed', icon: 'check' },
    { label: 'No drops', icon: 'check' },
    { label: 'Privacy and safety', icon: 'check' },
  ]).map((f) => ({ ...f, icon: f.icon || 'check' }));

  const handleAddToCart = (pkg) => {
    addToCart({
      slug: 'buy-tiktok-likes',
      tier: activeTab,
      platform: 'TikTok',
      serviceType: 'TikTok Likes',
      serviceName: `TikTok Likes - ${pkg.likes}`,
      type: 'Real Active',
      quantity: pkg.likes,
      price: pkg.price,
      likes: pkg.likes,
    });
  };

  const faqs = [
    {
      question: 'How quickly will I receive my TikTok likes?',
      answer: 'Delivery times vary depending on the package you choose. Regular likes typically start within a few hours, while Fast Likes begin immediately. All packages are designed to deliver likes gradually to ensure natural growth patterns.',
    },
    {
      question: 'Are the likes real and from real users?',
      answer: 'Yes! YoutubeADwords provides authentic likes from real users. Our likes come from organic discovery methods, ensuring they appear genuine and natural. We never use bots or fake accounts, which is why our likes have high retention rates and help activate TikTok\'s algorithm.',
    },
    {
      question: 'Will buying likes get my account banned?',
      answer: 'No, our service is completely safe. We use legitimate methods that comply with TikTok\'s terms of service. Our likes come from real users through organic discovery methods, so there\'s no risk to your account.',
    },
    {
      question: 'Can I choose which country the likes come from?',
      answer: 'Yes! Our system automatically analyzes your account and suggests the most suitable country for your target audience.',
    },
    {
      question: 'What happens if likes drop after delivery?',
      answer: 'We offer a refill guarantee on all our packages. If you experience any drops in likes, we will refill them at no additional cost.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <Layout>
      <SEO
        title="Buy TikTok Likes | YoutubeADwords"
        description="Buy real TikTok likes instantly. Boost your TikTok video engagement with YoutubeADwords' safe, organic likes packages."
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/30 transform -rotate-12 -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 transform rotate-12 -translate-x-32 translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6 svc-hero">
            <div className="mb-6 flex justify-center">
              <img
                src={resolveImageUrl(hero?.image, '/pricepage.png')}
                alt={hero?.title ?? 'Buy TikTok Likes'}
                className="w-[200px] h-auto object-cover bg-transparent"
              />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap svc-h1">
                {hero?.title ?? 'Buy TikTok Likes'}{' '}
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                  {hero?.badge ?? 'Instantly'}
                </span>
              </h1>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                {hero?.intro ?? 'YoutubeADwords is the safest way to buy TikTok Likes with delivery in just a few minutes. We offer multiple packages with real users for all different needs - choose wisely!'}
              </p>
            </div>
            <ServiceAssurance />
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100 svc-pass">
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {[{ id: 'regular', label: 'Real Active' }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedPackageIndex(null); }}
                  className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${activeTab === tab.id ? 'text-gray-900 border-b-2 border-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-6">
              {packages.map((pkg, index) => {
                const isSelected = selectedPackageIndex === index;
                return (
                  <div
                    key={index}
                    role="button"
                    tabIndex={0}
                    aria-pressed={selectedPackageIndex === index}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedPackageIndex(index);
                      }
                    }}
                    onClick={() => setSelectedPackageIndex(index)}
                    className={`rounded-full transition-colors cursor-pointer flex items-center ${isSelected ? 'bg-blue-600 p-[1px] md:p-[2px]' : 'bg-gray-50 hover:border-blue-600/50 p-0'}`}
                  >
                    <div className={`px-2 sm:px-4 py-1.5 sm:py-3 flex flex-col items-center justify-center min-w-[55px] sm:min-w-[90px] bg-white flex-shrink-0 ${isSelected ? 'border-[1.5px] md:border-2 border-blue-600 border-r-0 rounded-l-full' : 'rounded-l-full'}`}>
                      <div className="text-sm sm:text-2xl font-bold text-gray-900 leading-tight">{pkg.likes}</div>
                      <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-tighter">likes</div>
                    </div>
                    <div className={`flex-1 min-w-0 px-2 sm:px-4 py-1.5 sm:py-3 flex flex-col items-center justify-center rounded-r-full ${isSelected ? 'bg-blue-600' : ''}`}>
                      {pkg.originalPrice ? (
                        <>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-2">
                            <span className={`line-through text-[9px] sm:text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>${pkg.originalPrice}</span>
                            <span className={`font-bold text-xs sm:text-lg ${isSelected ? 'text-white' : 'text-blue-600'}`}>${pkg.price}</span>
                          </div>
                          <div className={`text-[8px] sm:text-xs font-black uppercase px-1.5 sm:px-3 py-0.5 rounded-full mt-0.5 ${isSelected ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>save {pkg.discount}</div>
                        </>
                      ) : (
                        <div className={`font-bold text-sm sm:text-xl ${isSelected ? 'text-white' : 'text-gray-900'}`}>${pkg.price}</div>
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
                        slug: 'buy-tiktok-likes',
                        allPackages: likePackages,
                        serviceType: 'TikTok Likes',
                        typeLabels: { regular: 'Real Active' },
                        quantityKey: 'likes',
                        unitLabel: 'likes',
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
{/* All In One TikTok Likes Campaign Section */}
        <div className="mt-12 lg:mt-16 svc-offer lp-reveal">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            {/* Decorative blue shape */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100/40 transform rotate-12 -translate-x-8 translate-y-8"></div>

            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
              {/* Left Section */}
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  All In One TikTok Likes Campaign
                </h2>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
                    Best Offer
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                  With YoutubeADwords's all-inclusive package, you can{' '}
                  <span className="text-blue-600 font-semibold">buy TikTok likes</span>, and followers simultaneously. Moreover, you may order{' '}
                  <span className="text-blue-600 font-semibold">TikTok views service</span> and add it to the package for the best price.
                </p>
              </div>

              {/* Right Section - Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    5000
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    Likes for chosen video
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    1000
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    Views for chosen video
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    100
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    New followers at once
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    Customer Support
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 svc-faq lp-reveal">
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
