import React, { useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { useCheckout } from '../hooks/useCheckout';
import { usePricingPackages, usePricingPageContent } from '../contexts/ContentContext';
import { resolveImageUrl } from '../utils/image';
import { useCtaActions } from '../contexts/CtaActionsContext';
import ServiceAssurance from '../components/ServiceAssurance';
import { submitReview } from '../utils/reviews';

const viewPackagesFallback = {
  regular: [
    { views: '100', price: '1.34', originalPrice: '1.49', discount: '10%' },
    { views: '1.0K', price: '3.96', originalPrice: '4.40', discount: '10%' },
    { views: '2.5K', price: '9.81', originalPrice: '10.90', discount: '10%' },
    { views: '5.0K', price: '19.78', originalPrice: '21.98', discount: '10%' },
  ],
  fast: [
    { views: '10.0K', price: '34.11', originalPrice: '37.90', discount: '10%' },
    { views: '25.0K', price: '85.50', originalPrice: '95.00', discount: '10%' },
    { views: '50.0K', price: '161.10', originalPrice: '179.00', discount: '10%' },
    { views: '75.0K', price: '256.50', originalPrice: '285.00', discount: '10%' },
    { views: '100K', price: '314.10', originalPrice: '349.00', discount: '10%' },
    { views: '250K', price: '764.10', originalPrice: '849.00', discount: '10%' },
    { views: '500K', price: '1431.00', originalPrice: '1590.00', discount: '10%' },
    { views: '750K', price: '2146.50', originalPrice: '2385.00', discount: '10%' },
    { views: '1.0M', price: '2862.00', originalPrice: '3180.00', discount: '10%' },
  ],
  ads: [
    { views: '500K', price: '882.00', originalPrice: '980.00', discount: '10%' },
    { views: '1.0M', price: '1665.00', originalPrice: '1850.00', discount: '10%' },
    { views: '2.5M', price: '3330.00', originalPrice: '3700.00', discount: '10%' },
    { views: '5.0M', price: '6210.00', originalPrice: '6900.00', discount: '10%' },
  ],
};

const featuresFallback = [
  { label: 'Real & Organic Views', icon: 'check' },
  { label: 'High Quality', icon: 'check' },
  { label: 'Instant start', icon: 'check' },
  { label: 'Refill Guaranteed', icon: 'check' },
  { label: 'No drops', icon: 'check' },
  { label: 'Privacy and safety', icon: 'check' },
];

const faqsFallback = [
  { question: 'How quickly will I receive my YouTube views?', answer: 'Delivery times vary depending on the package you choose. Regular views typically start within a few hours, while Fast Views begin immediately. Ads Views are delivered through Google Ads campaigns and may take 24-48 hours to start. All packages are designed to deliver views gradually to ensure natural growth patterns.' },
  { question: 'Are the views real and from real users?', answer: 'Yes! YoutubeADwords provides authentic views from real users. Our views come from recommended videos in YouTube Analytics, ensuring they appear organic and natural. We never use bots or fake accounts, which is why our views have high retention rates and help activate YouTube\'s algorithm.' },
  { question: 'Will buying views get my channel banned?', answer: 'No, our service is completely safe. We use legitimate methods that comply with YouTube\'s terms of service. Our views come from real users through organic discovery methods, so there\'s no risk to your channel. We\'ve been providing this service safely for years.' },
  { question: 'Can I choose which country the views come from?', answer: 'Yes! Our system automatically analyzes your channel and suggests the most suitable country for your target audience. You can also manually select a specific country when placing your order to ensure the views align with your content\'s target demographic.' },
  { question: 'What happens if views drop after delivery?', answer: 'We offer a refill guarantee on all our packages. If you experience any drops in views, we will refill them at no additional cost. Our high-quality views have excellent retention rates, but we stand behind our service with this guarantee.' },
  { question: 'Can I buy views for multiple videos at once?', answer: 'Absolutely! You can purchase views for as many videos as you like. Many of our customers buy views for every video they produce to maintain consistent growth and engagement across their channel.' },
];

export default function BuyYouTubeViewsPage() {
  const { addToCart } = useCart();
  const { isEnabled } = useCtaActions();
  const canBuy = isEnabled('buy');
  const canAddToCart = isEnabled('add_to_cart');
  const { goToCheckout } = useCheckout();
  const viewPackages = usePricingPackages('buy-youtube-views', viewPackagesFallback);
  const content = usePricingPageContent('buy-youtube-views', null);
  const [activeTab, setActiveTab] = useState('regular');
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
  const packages = viewPackages ? viewPackages[activeTab] : [];

  const hero = content?.hero;
  const tabs = content?.tabs;
  const infoBanner = content?.infoBanner;
  const features = (content?.features?.length ? content.features : featuresFallback).map((f) => ({ ...f, icon: 'check' }));
  const faqs = content?.faq?.items?.length ? content.faq.items : faqsFallback;

  const handleAddToCart = (pkg) => {
    addToCart({
      slug: 'buy-youtube-views',
      tier: activeTab,
      platform: 'YouTube',
      serviceType: 'YouTube Views',
      serviceName: `YouTube Views - ${pkg.views}`,
      type: activeTab === 'regular' ? 'Regular Views' : activeTab === 'fast' ? 'Fast Views' : 'Ads Views',
      quantity: pkg.views,
      price: pkg.price,
      views: pkg.views,
    });
  };

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const tabList = [
    { id: 'regular', label: tabs?.regular ?? 'Regular Views' },
    { id: 'fast', label: tabs?.fast ?? 'Fast Views' },
    { id: 'ads', label: tabs?.ads ?? 'Ads Views' },
  ];

  return (
    <Layout>
      <SEO
        title="Buy YouTube Views | YoutubeADwords"
        description="Buy real YouTube views instantly. YoutubeADwords offers high-retention, organic YouTube views at the best prices. Choose from Regular, Fast, and Ads views packages."
      />
      {/* Background decorative shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/30 transform -rotate-12 -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-100/20 transform rotate-12 -translate-x-32 translate-y-32"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Section - Information */}
          <div className="space-y-6">
            {/* Image */}
            <div className="mb-6 flex justify-center">
              <img
                src={resolveImageUrl(hero?.image, '/pricepage.png')}
                alt={hero?.title ?? 'Buy YouTube Views'}
                className="w-[200px] h-auto object-cover bg-transparent"
              />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
                {hero?.title ?? 'Buy YouTube Views'}{' '}
                <span className="bg-brand-red text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                  {hero?.badge ?? 'Instantly'}
                </span>
              </h1>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                {hero?.intro ?? 'YoutubeADwords is the safest way to buy YouTube Views with delivery in just a few minutes. We offer multiple packages with real users for all different needs - choose wisely!'}
              </p>
            </div>
            <ServiceAssurance />
          </div>

          {/* Right Section - Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 overflow-x-auto -mx-1 px-1">
              {tabList.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedPackageIndex(null);
                  }}
                  className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${activeTab === tab.id
                    ? 'text-gray-900 border-b-2 border-brand-red'
                    : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Information Banner */}
            {(infoBanner ?? true) && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <p className="text-gray-700 text-sm">
                  {infoBanner ? (
                    <><span className="font-medium">Information:</span> {String(infoBanner).replace(/^\s*Information:\s*/i, '')}</>
                  ) : (
                    <><span className="font-medium">Information:</span> We recommend our <span className="text-brand-red font-semibold">Fast YouTube Views</span> packages for orders with a high number of views.</>
                  )}
                </p>
              </div>
            )}

            {/* View Packages Grid */}
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
                    className={`rounded-full transition-colors cursor-pointer flex items-center ${isSelected ? 'bg-brand-red p-[1px] md:p-[2px]' : 'bg-gray-50 hover:border-brand-red/50 p-0'}`}
                  >
                    <div className={`px-2 sm:px-4 py-1.5 sm:py-3 flex flex-col items-center justify-center min-w-[55px] sm:min-w-[90px] bg-white flex-shrink-0 ${isSelected ? 'border-[1.5px] md:border-2 border-brand-red border-r-0 rounded-l-full' : 'rounded-l-full'}`}>
                      <div className="text-sm sm:text-2xl font-bold text-gray-900 leading-tight">{pkg.views}</div>
                      <div className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-tighter">views</div>
                    </div>
                    <div className={`flex-1 min-w-0 px-2 sm:px-4 py-1.5 sm:py-3 flex flex-col items-center justify-center rounded-r-full ${isSelected ? 'bg-brand-red' : ''}`}>
                      {pkg.originalPrice ? (
                        <>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-2">
                            <span className={`line-through text-[9px] sm:text-sm ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>${pkg.originalPrice}</span>
                            <span className={`font-bold text-xs sm:text-lg ${isSelected ? 'text-white' : 'text-brand-red'}`}>${pkg.price}</span>
                          </div>
                          <div className={`text-[8px] sm:text-xs font-black uppercase px-1.5 sm:px-3 py-0.5 rounded-full mt-0.5 ${isSelected ? 'bg-white text-brand-red' : 'bg-brand-red text-white'}`}>save {pkg.discount}</div>
                        </>
                      ) : (
                        <div className={`font-bold text-sm sm:text-xl ${isSelected ? 'text-white' : 'text-gray-900'}`}>${pkg.price}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buy Now and Add to Cart Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  if (selectedPackageIndex !== null) {
                    const selectedPkg = packages[selectedPackageIndex];
                    const serviceLabel = `YouTube Views - ${selectedPkg.views}`;
                    goToCheckout({
                      slug: 'buy-youtube-views',
                      tier: activeTab,
                      pkg: selectedPkg,
                      platform: 'YouTube',
                      serviceLabel,
                      quantityKey: 'views',
                    });
                  }
                }}
                disabled={selectedPackageIndex === null || !canBuy}
                className="flex-1 bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-[#C62828] transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                {canBuy ? 'Buy now' : 'Buy disabled'}
              </button>
              <button
                onClick={() => {
                  if (selectedPackageIndex !== null) {
                    handleAddToCart(packages[selectedPackageIndex]);
                  }
                }}
                disabled={selectedPackageIndex === null || !canAddToCart}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                {canAddToCart ? 'Add to cart' : 'Add to cart disabled'}
              </button>
            </div>

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

        {/* All In One YouTube Views Campaign Section */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-100/40 transform rotate-12 -translate-x-8 translate-y-8"></div>
            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {content?.allInOne?.heading ?? 'All In One YouTube Views Campaign'}
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-yellow-400 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider">
                    Best Offer
                  </div>
                </div>
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                  {content?.allInOne?.description ?? "With YoutubeADwords's all-inclusive package, you can buy YouTube subscribers, and views simultaneously. Moreover, you may order YouTube likes service and add it to the package for the best price."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {((content?.allInOne?.stats?.length && content.allInOne.stats) || [
                  { value: '5000', label: 'Views for chosen video' },
                  { value: '1000', label: 'Likes for chosen video' },
                  { value: '100', label: 'New active subscribers at once' },
                  { value: '24/7', label: 'Customer Support' },
                ]).map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-brand-red mb-2">{stat.value}</div>
                    <div className="text-gray-700 text-sm lg:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* YoutubeADwords's Guarantee Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {content?.guarantee?.heading ?? "YoutubeADwords's Guarantee When You Buy YouTube Views"}
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>{content?.guarantee?.intro1 ?? "We know that you put in a lot of hours to produce amazing content on YouTube. YoutubeADwords works to give your content the popularity you deserve. With our services, your superb content is crowned with the reward of hundreds of thousands of views, just select how many you want!"}</p>
                <p>{content?.guarantee?.intro2 ?? "To grow their YouTube subscribers and likes daily with YoutubeADwords, our customers buy YouTube views for every video they produce."}</p>
              </div>
            </div>
            {(content?.guarantee?.cards?.length ? content.guarantee.cards : [
              { title: 'Know the Specific Source of YouTube Views', body: 'Our customers who buy views from us see in YouTube Analytics that the views come from recommended videos. In this way, it also increases the number of views on your videos organically. You can do a trial of our free YouTube views service before purchasing.' },
              { title: 'Get Views from the Suitable Country for Your Channel', body: 'After selecting the number of views you want to buy, you will be asked to enter the link of your video. Our system will automatically check your channel and will suggest a suitable country for your channel on the next screen. In this way, you will get a boost in views from viewers that are in alignment with your target audience.' },
              { title: 'Lowest Price Guaranteed', body: "YoutubeADwords services guarantee you the cheapest YouTube views on the market. If you find the same quality of YouTube views at a cheaper price, please let us know about it, and we promise to provide you with service at that price." },
              { title: 'Support Team Working Every Day of the Week', body: "One side of the world is day meanwhile the other side is night, but this does not affect our service. Our team is available 24/7 to answer your questions about our YouTube growth services, no matter what country you live in." },
              { title: 'Slow or Fast Viewing Preference', body: "Everyone wants the number of views on their content to grow at different speeds. You can buy slow or fast views according to your preference. YoutubeADwords adapts to whatever your preference is to give you the best satisfaction." },
            ]).slice(0, 1).map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
                <div className="mb-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-brand-red rounded transform rotate-12 shadow-lg"></div>
                    <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {(content?.guarantee?.cards?.length ? content.guarantee.cards : [
              { title: 'Know the Specific Source of YouTube Views', body: 'Our customers who buy views from us see in YouTube Analytics that the views come from recommended videos. In this way, it also increases the number of views on your videos organically. You can do a trial of our free YouTube views service before purchasing.' },
              { title: 'Get Views from the Suitable Country for Your Channel', body: 'After selecting the number of views you want to buy, you will be asked to enter the link of your video. Our system will automatically check your channel and will suggest a suitable country for your channel on the next screen. In this way, you will get a boost in views from viewers that are in alignment with your target audience.' },
              { title: 'Lowest Price Guaranteed', body: "YoutubeADwords services guarantee you the cheapest YouTube views on the market. If you find the same quality of YouTube views at a cheaper price, please let us know about it, and we promise to provide you with service at that price." },
              { title: 'Support Team Working Every Day of the Week', body: "One side of the world is day meanwhile the other side is night, but this does not affect our service. Our team is available 24/7 to answer your questions about our YouTube growth services, no matter what country you live in." },
              { title: 'Slow or Fast Viewing Preference', body: "Everyone wants the number of views on their content to grow at different speeds. You can buy slow or fast views according to your preference. YoutubeADwords adapts to whatever your preference is to give you the best satisfaction." },
            ]).slice(1).map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
                <div className="mb-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-brand-red rounded transform rotate-12 shadow-lg"></div>
                    <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-700 text-sm lg:text-base leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Do You Need To Buy YouTube Views Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <img
                src={resolveImageUrl(content?.whySection?.image, '/demo1.jpg')}
                alt={content?.whySection?.heading ?? 'YouTube Views Growing'}
                className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {content?.whySection?.heading ?? 'Why Do You Need To Buy YouTube Views?'}
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>{content?.whySection?.paragraph1 ?? "The number of views your YouTube video has is one of the most important factors that determine the quality and performance of your video. When visitors see that your video has a high number of views, they will think that your video is valuable and worth watching."}</p>
                <p>{content?.whySection?.paragraph2 ?? "This increases the chances that they will click on your video and watch it. In addition, YouTube's algorithm favors videos with more views, which means that videos with more views are more likely to appear in search results and be recommended to other users."}</p>
                <p>{content?.whySection?.paragraph3 ?? "Therefore, buying YouTube views can help you improve your video's visibility and reach a wider audience. It can also help you build social proof and credibility, which can lead to more organic views and subscribers in the long run."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Numbers, Engagement, and Reputation Section */}
        <div className="mt-12 lg:mt-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {content?.numbersSection?.heading ?? 'Numbers, Engagement, and Reputation; YoutubeADwords'}
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>{content?.numbersSection?.paragraph1 ?? "What is your expectation? Do you just want numerical superiority? Do you want your videos reach more viewers? Or do you want your company's ad to look good online? What about making money from YouTube?"}</p>
                <p>{content?.numbersSection?.paragraph2 ?? "Numbers are everything in today's digital world. Buying views makes a quick and immediate contribution to your numerical superiority, making you seem like a legit channel for viewers to flock to."}</p>
                <p>{content?.numbersSection?.paragraph3 ?? "What number of views will satisfy you? Would 100,000 views look good on a video promoting your company? YoutubeADwords can provide this for you. Thanks to the quality views we send to your videos, we're able to activate the YouTube algorithm and make the system work for you."}</p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-100/40 rounded-lg transform rotate-12 -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-100/40 rounded-lg transform -rotate-12 -z-10"></div>
                <img
                  src={resolveImageUrl(content?.numbersSection?.image, '/demo1.jpg')}
                  alt={content?.numbersSection?.heading ?? 'Content Creation'}
                  className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* An Excellent Strategy Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-red-100/40 rounded-lg transform rotate-12 -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-100/40 rounded-lg transform -rotate-12 -z-10"></div>
                <img
                  src={resolveImageUrl(content?.strategySection?.image, '/demo2.jpg')}
                  alt={content?.strategySection?.heading ?? 'YouTube Channel Strategy'}
                  className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
                />
              </div>
            </div>
            <div className="space-y-4 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {content?.strategySection?.heading ?? 'An Excellent Strategy To Uplift Your YouTube Channel'}
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>{content?.strategySection?.paragraph1 ?? "Organic views are great, but if you're in need, it is possible to buy YouTube views and buy YouTube watch hours that will provide you with just as much influence in way shorter time."}</p>
                <p>{content?.strategySection?.paragraph2 ?? "The majority of YouTube visitors never question where these numbers come from. They accept them as quality engagement without thinking too deeply about their origin or authenticity. This means that buying views on YouTube may be an excellent strategy to uplift your YouTube channel. The bought views serve as an effective support base and a credibility for visitors to become subscribers."}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 lg:mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
              {content?.faq?.heading ? (
                content.faq.heading
              ) : (
                <>
                  Frequently Asked{' '}
                  <span className="text-brand-red relative">
                    Questions
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
                  </span>
                </>
              )}
            </h2>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4 flex-1">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFAQIndex === index ? (
                        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {openFAQIndex === index && (
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Chart Section */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-7xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Why Choose YoutubeADwords?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                See how we compare to other providers across key features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Criteria */}
              <div className="space-y-3">
                <div className="h-20 flex items-center border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900">Comparison Criteria</h3>
                </div>
                {[
                  'Authenticity of Views',
                  'Delivery Reliability',
                  'Viewer Retention',
                  'Pricing Structure',
                  'Channel Safety',
                  'Impact on Growth',
                  'Customer Assistance',
                  'Package Adaptability',
                  'Trust & Credibility',
                ].map((criterion, index) => (
                  <div key={index} className="flex items-center gap-3 min-h-[70px] py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-sm lg:text-base font-medium text-gray-800 leading-relaxed">{criterion}</span>
                  </div>
                ))}
              </div>

              {/* Middle Column - YOUTUBE AD WORDS */}
              <div className="border-4 border-brand-red rounded-3xl p-6 lg:p-8 bg-white shadow-xl relative overflow-hidden">
                {/* Highlighted Badge */}
                <div className="absolute top-0 right-0 bg-brand-red text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
                  BEST CHOICE
                </div>

                <div className="mb-8 flex items-center justify-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-black font-bold text-xl lg:text-2xl">YOUTUBE</span>
                    <span className="bg-brand-red text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">AD</span>
                    <span className="text-black font-bold text-xl lg:text-2xl">WORDS</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    'Real, organic audiences',
                    'Fast, secure, and consistent',
                    'Long watch duration',
                    'Transparent & affordable',
                    '100% secure, no bans',
                    'Improves rankings & visibility',
                    '24/7 professional support',
                    'Flexible to all needs',
                    'Trusted by creators',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 min-h-[70px] py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm lg:text-base text-gray-800 font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Other Providers */}
              <div className="bg-gray-50 rounded-3xl p-6 lg:p-8 border border-gray-200 shadow-md">
                <div className="mb-8 flex items-center justify-center pt-2">
                  <div className="bg-gray-200 text-gray-700 rounded-full px-5 py-2.5 inline-block">
                    <span className="text-sm font-bold">Other Providers</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    'Bot-driven traffic',
                    'Delayed, unstable',
                    'Low retention, quick drops',
                    'Hidden costs, overpriced',
                    'High risk of penalties',
                    'No effect on algorithm',
                    'Little or no support',
                    'Generic one-size plans',
                    'Unreliable providers',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 min-h-[70px] py-3 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm lg:text-base text-gray-600 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
                Reviews
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">Average: 4.9 / 5</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Cards */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Review 1 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  This is nice website for YouTube subscriber and more service
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Parth Rathod</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Thank you for everything
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Jack J DeFeo</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Good
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Lofi Music</span>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave a Review Section */}
        <div className="mt-16 lg:mt-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/80 transform rotate-12"></div>

              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Leave a review
                </h2>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setReviewError('');
                    try {
                      await submitReview({ page: 'buy-youtube-views', name: formData.name, email: formData.email, rating, text: formData.review });
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 5000);
                      setFormData({ name: '', email: '', review: '' });
                      setRating(0);
                    } catch (err) {
                      setReviewError(err.message);
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email <span className="text-brand-red">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating <span className="text-brand-red">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
                            className="focus:outline-none"
                          >
                            {i < rating ? (
                              <svg className="w-8 h-8 text-brand-red cursor-pointer hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-gray-300 cursor-pointer hover:text-brand-red/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                      <span className="bg-brand-red text-white rounded-full px-3 py-1 text-sm font-medium">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Text Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review <span className="text-brand-red">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent resize-none"
                      placeholder="Write your review here..."
                    />
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium" role="status">Thanks! Your review will appear after moderation.</span>
                    </div>
                  )}
                  {reviewError && (
                    <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{reviewError}</div>
                  )}



                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
