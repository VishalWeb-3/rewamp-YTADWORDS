import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { usePricingPackages } from '../contexts/ContentContext';

const localGuideReviewsPackagesFallback = {
  regular: [
    { rereviews: '10', price: '39.90', originalPrice: null, discount: null },
    { rereviews: '25', price: '89.90', originalPrice: '135.00', discount: '33%' },
    { rereviews: '50', price: '169.90', originalPrice: '255.00', discount: '33%' },
    { rereviews: '100', price: '329.90', originalPrice: '495.00', discount: '33%' },
  ],
  fast: [
    { rereviews: '10', price: '49.90', originalPrice: null, discount: null },
    { rereviews: '25', price: '109.90', originalPrice: '165.00', discount: '33%' },
    { rereviews: '50', price: '209.90', originalPrice: '315.00', discount: '33%' },
    { rereviews: '100', price: '409.90', originalPrice: '615.00', discount: '33%' },
  ],
  ads: [
    { rereviews: '10', price: '59.90', originalPrice: null, discount: null },
    { rereviews: '25', price: '139.90', originalPrice: '210.00', discount: '33%' },
    { rereviews: '50', price: '269.90', originalPrice: '405.00', discount: '33%' },
    { rereviews: '100', price: '529.90', originalPrice: '795.00', discount: '33%' },
  ],
};

const features = [
  { label: 'Real Local Guide Rereviewers', icon: 'check' },
  { label: 'High Quality Reviews', icon: 'check' },
  { label: 'Instant start', icon: 'check' },
  { label: 'Refill Guaranteed', icon: 'check' },
  { label: 'No drops', icon: 'check' },
  { label: 'Privacy and safety', icon: 'check' },
];

export default function BuyGoogleLocalGuideReviewsPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const localGuideReviewsPackages = usePricingPackages('buy-google-local-guide-reviews', localGuideReviewsPackagesFallback);
  const [activeTab, setActiveTab] = useState('regular');
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(null);
  const packages = localGuideReviewsPackages ? localGuideReviewsPackages[activeTab] : [];

  const handleAddToCart = (pkg) => {
    addToCart({
      serviceType: 'Google Local Guide Reviews',
      serviceName: `Google Local Guide Reviews - ${pkg.rereviews}`,
      type: activeTab === 'regular' ? 'Regular Reviews' : activeTab === 'fast' ? 'Fast Reviews' : 'Premium Reviews',
      quantity: pkg.rereviews,
      price: pkg.price,
      reviews: pkg.rereviews,
    });
  };

  const faqs = [
    {
      question: 'How quickly will I receive my Google reviews?',
      answer: 'Delivery times vary depending on the package you choose. Regular reviews typically start within a few hours, while Fast Views begin immediately. Ads Views are delivered through Google Ads campaigns and may take 24-48 hours to start. All packages are designed to deliver reviews gradually to ensure natural growth patterns.',
    },
    {
      question: 'Are the reviews real and from real users?',
      answer: 'Yes! Views4You provides authentic reviews from real users. Our reviews come from recommended videos in Google Analytics, ensuring they appear organic and natural. We never use bots or fake accounts, which is why our reviews have high retention rates and help activate Google\'s algorithm.',
    },
    {
      question: 'Will buying reviews get my business banned?',
      answer: 'No, our service is completely safe. We use legitimate methods that comply with Google\'s terms of service. Our reviews come from real users through organic discovery methods, so there\'s no risk to your business. We\'ve been providing this service safely for years.',
    },
    {
      question: 'Can I choose which country the reviews come from?',
      answer: 'Yes! Our system automatically analyzes your business and suggests the most suitable country for your target audience. You can also manually select a specific country when placing your order to ensure the reviews align with your content\'s target demographic.',
    },
    {
      question: 'What happens if reviews drop after delivery?',
      answer: 'We offer a refill guarantee on all our packages. If you experience any drops in reviews, we will refill them at no additional cost. Our high-quality reviews have excellent retention rates, but we stand behind our service with this guarantee.',
    },
    {
      question: 'Can I buy reviews for multiple videos at once?',
      answer: 'Absolutely! You can purchase reviews for as many videos as you like. Many of our customers buy reviews for every video they produce to maintain consistent growth and engagement across their business.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  return (
    <Layout>
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
                src="/pricepage.png"
                alt="Buy Google Local Guide Reviews"
                className="w-[200px] h-auto object-cover bg-transparent"
              />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
                Buy Google Local Guide Reviews{' '}
                <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                  Instantly
                </span>
              </h1>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Views4You is the safest way to buy Google Local Guide Reviews with delivery in just a few minutes. We offer multiple packages with real Google Local Guide reviewers for all different needs - choose wisely!
              </p>
            </div>
          </div>

          {/* Right Section - Pricing Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              {[
                { id: 'regular', label: 'Regular Reviews' },
                { id: 'fast', label: 'Fast Reviews' },
                { id: 'ads', label: 'Premium Reviews' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedPackageIndex(null);
                  }}
                  className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 border-b-2 border-green-500'
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
                <span className="text-green-500 font-semibold">Fast Google Local Guide Reviews</span> packages for orders with a high number of reviews.
              </p>
            </div>

            {/* View Packages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {packages.map((pkg, index) => {
                const isSelected = selectedPackageIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedPackageIndex(index)}
                    className={`rounded-full transition-colors cursor-pointer flex items-center ${
                      isSelected ? 'bg-green-500 p-[2px]' : 'bg-gray-50 hover:border-green-500/50 p-0'
                    }`}
                  >
                    {/* Left Section - Reviews Quantity (White) */}
                    <div className={`px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] bg-white flex-shrink-0 ${
                      isSelected ? 'border-2 border-green-500 border-r-0 rounded-l-full' : 'rounded-l-full'
                    }`}>
                      <div className="text-lg sm:text-2xl font-bold text-gray-900">
                        {pkg.reviews}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        reviews
                      </div>
                    </div>
                    
                    {/* Right Section - Price */}
                    <div className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center rounded-r-full ${
                      isSelected ? 'bg-green-500' : ''
                    }`}>
                      {pkg.originalPrice ? (
                        <>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 mb-1">
                            <span className={`line-through text-xs sm:text-sm ${
                              isSelected ? 'text-white' : 'text-gray-400'
                            }`}>
                              ${pkg.originalPrice}
                            </span>
                            <span className={`font-bold text-base sm:text-lg ${
                              isSelected ? 'text-white' : 'text-green-500'
                            }`}>
                              ${pkg.price}
                            </span>
                          </div>
                          <div className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${
                            isSelected ? 'bg-black text-white' : 'bg-green-500 text-white'
                          }`}>
                            save {pkg.discount}
                          </div>
                        </>
                      ) : (
                        <div className={`font-bold text-base sm:text-xl ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          ${pkg.price}
                        </div>
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
                    navigate('/get-started', {
                      state: {
                        allPackages: localGuideReviewsPackages,
                        serviceType: 'Google Local Guide Reviews',
                        typeLabels: { regular: 'Regular Reviews', fast: 'Fast Reviews', ads: 'Premium Reviews' },
                        quantityKey: 'rereviews',
                        unitLabel: 'reviews',
                        initialType: activeTab,
                        initialPackage: selectedPkg,
                      },
                    });
                  }
                }}
                disabled={selectedPackageIndex === null}
                className="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                Buy now
              </button>
              <button
                onClick={() => { if (selectedPackageIndex !== null) handleAddToCart(packages[selectedPackageIndex]); }}
                disabled={selectedPackageIndex === null}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
              >
                Add to cart
              </button>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
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

        {/* All In One Google Local Guide Reviews Campaign Section */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
            {/* Decorative red shape */}
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-100/40 transform rotate-12 -translate-x-8 translate-y-8"></div>
            
            <div className="grid lg:grid-cols-2 gap-8 relative z-10">
              {/* Left Section */}
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  All In One Google Local Guide Reviews Campaign
                </h2>
                
                {/* Price and Buy Now Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="bg-green-500 text-white font-bold px-6 py-3 rounded-full text-lg">
                    $47.49
                  </div>
                  <button className="bg-gray-900 text-white font-bold px-6 py-3 rounded-full text-lg hover:bg-gray-800 transition-colors">
                    Buy now
                  </button>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                  With Views4You's all-inclusive package, you can{' '}
                  <span className="text-green-500 font-semibold">buy Google subscribers</span>, and reviews simultaneously. Moreover, you may order{' '}
                  <span className="text-green-500 font-semibold">Google likes service</span> and add it to the package for the best price.
                </p>
              </div>
              
              {/* Right Section - Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-green-500 mb-2">
                    5000
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    Views for chosen video
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-green-500 mb-2">
                    1000
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    Likes for chosen video
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-green-500 mb-2">
                    100
                  </div>
                  <div className="text-gray-700 text-sm lg:text-base">
                    New active subscribers at once
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold text-green-500 mb-2">
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

        {/* Views4You's Guarantee Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Section - Heading and Intro */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Views4You's Guarantee When You Buy Google Local Guide Reviews
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>
                  We know that you put in a lot of hours to produce amazing content on Google. Views4You works to give your content the popularity you deserve. With our services, your superb content is crowned with the reward of hundreds of thousands of reviews, just select how many you want!
                </p>
                <p>
                  To grow their Google subscribers and likes daily with Views4You, our customers buy Google reviews for every video they produce.
                </p>
              </div>
            </div>

            {/* Right Section - First Feature Card */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="mb-4">
                {/* Red 3D Icon */}
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-green-500 rounded transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-lg sm:text-2xl font-bold text-gray-900 mb-3">
                Know the Specific Source of Google Local Guide Reviews
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                Our customers who buy reviews from us see in Google Analytics that the reviews come from recommended videos. In this way, it also increases the number of reviews on your videos organically. You can do a trial of our free Google reviews service before purchasing.
              </p>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="mb-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-green-500 rounded transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-lg sm:text-2xl font-bold text-gray-900 mb-3">
                Get Views from the Suitable Country for Your Channel
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                After selecting the number of reviews you want to buy, you will be asked to enter the link of your video. Our system will automatically check your business and will suggest a suitable country for your business on the next screen. In this way, you will get a boost in reviews from reviewers that are in alignment with your target audience.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="mb-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-green-500 rounded transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-lg sm:text-2xl font-bold text-gray-900 mb-3">
                Lowest Price Guaranteed
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                Views4You services guarantee you the cheapest Google reviews on the market. If you find the same quality of Google reviews at a cheaper price, please let us know about it, and we promise to provide you with service at that price.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="mb-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-green-500 rounded transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-lg sm:text-2xl font-bold text-gray-900 mb-3">
                Support Team Working Every Day of the Week
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                One side of the world is day meanwhile the other side is night, but this does not affect our service. Our team is available 24/7 to answer your questions about our Google growth services, no matter what country you live in.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md">
              <div className="mb-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-green-500 rounded transform rotate-12 shadow-lg"></div>
                  <div className="absolute inset-0 bg-red-400/50 rounded transform rotate-6 translate-x-1 translate-y-1"></div>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-xl lg:text-lg sm:text-2xl font-bold text-gray-900 mb-3">
                Slow or Fast Viewing Preference
              </h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed">
                Everyone wants the number of reviews on their content to grow at different speeds. You can buy slow or fast reviews according to your preference. Views4You adapts to whatever your preference is to give you the best satisfaction.
              </p>
            </div>
          </div>
        </div>

        {/* Why Do You Need To Buy Google Local Guide Reviews Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - GIF */}
            <div className="flex justify-center lg:justify-start">
              <img
                src="/demo1.jpg"
                alt="Google Local Guide Reviews Growing"
                className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
              />
            </div>

            {/* Right Section - Text Content */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Why Do You Need To Buy Google Local Guide Reviews?
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>
                  The number of reviews your Google video has is one of the most important factors that determine the quality and performance of your video. When visitors see that your video has a high number of reviews, they will think that your video is valuable and worth watching.
                </p>
                <p>
                  This increases the chances that they will click on your video and watch it. In addition, Google's algorithm favors videos with more reviews, which means that videos with more reviews are more likely to appear in search results and be recommended to other users.
                </p>
                <p>
                  Therefore, buying Google reviews can help you improve your video's visibility and reach a wider audience. It can also help you build social proof and credibility, which can lead to more organic reviews and subscribers in the long run.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Numbers, Engagement, and Reputation Section */}
        <div className="mt-12 lg:mt-32">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Text Content */}
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Numbers, Engagement, and Reputation; Views4You
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>
                  What is your expectation? Do you just want numerical superiority? Do you want your videos reach more reviewers? Or do you want your company's ad to look good online? What about making money from Google?
                </p>
                <p>
                  Numbers are everything in today's digital world. Buying reviews makes a quick and immediate contribution to your numerical superiority, making you seem like a legit business for reviewers to flock to.
                </p>
                <p>
                  What number of reviews will satisfy you? Would 100,000 reviews look good on a video promoting your company? Views4You can provide this for you. Thanks to the quality reviews we send to your videos, we're able to activate the Google algorithm and make the system work for you.
                </p>
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Decorative shapes */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-100/40 rounded-lg transform rotate-12 -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-100/40 rounded-lg transform -rotate-12 -z-10"></div>
                
                {/* Main image */}
                <img
                  src="/demo1.jpg"
                  alt="Content Creation"
                  className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* An Excellent Strategy Section */}
        <div className="mt-12 lg:mt-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Section - Image */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative">
                {/* Decorative shapes */}
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-red-100/40 rounded-lg transform rotate-12 -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-100/40 rounded-lg transform -rotate-12 -z-10"></div>
                
                {/* Main image */}
                <img
                  src="/demo2.jpg"
                  alt="Google Channel Strategy"
                  className="w-full max-w-md h-auto rounded-2xl shadow-xl object-cover relative z-10"
                />
              </div>
            </div>

            {/* Right Section - Text Content */}
            <div className="space-y-4 order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                An Excellent Strategy To Uplift Your Google Channel
              </h2>
              <div className="space-y-4 text-gray-700 text-base lg:text-lg leading-relaxed">
                <p>
                  Organic reviews are great, but if you're in need, it is possible to{' '}
                  <span className="text-green-500 font-semibold">buy Google reviews</span> and{' '}
                  <span className="text-green-500 font-semibold">buy Google watch hours</span> that will provide you with just as much influence in way shorter time.
                </p>
                <p>
                  The majority of Google visitors never question where these numbers come from. They accept them as quality engagement without thinking too deeply about their origin or authenticity. This means that buying reviews on Google may be an excellent strategy to uplift your Google business. The bought reviews serve as an effective support base and a credibility for visitors to become subscribers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 lg:mt-16">
          <div className="max-w-4xl mx-auto">
            {/* Heading */}
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
              Frequently Asked{' '}
              <span className="text-green-500 relative">
                Questions
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500" />
              </span>
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
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                Why Choose Views4You?
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

              {/* Middle Column - VIEWS 4 YOU */}
              <div className="border-4 border-green-500 rounded-3xl p-6 lg:p-8 bg-white shadow-xl relative overflow-hidden">
                {/* Highlighted Badge */}
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
                  BEST CHOICE
                </div>
                
                <div className="mb-8 flex items-center justify-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-black font-bold text-base sm:text-xl lg:text-2xl">VIEWS</span>
                    <span className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-base sm:text-lg shadow-lg">4</span>
                    <span className="text-black font-bold text-base sm:text-xl lg:text-2xl">YOU</span>
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
                        <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
                    <svg key={i} className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
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
                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  This is nice website for Google subscriber and more service
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Parth Rathod</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Thank you for everything
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Jack J DeFeo</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100">
                <div className="mb-4">
                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-base mb-6 leading-relaxed">
                  Good
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Lofi Music</span>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 20 20">
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
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 transform rotate-45 translate-x-8 -translate-y-8"></div>
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/80 transform rotate-12"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Leave a review
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 5000);
                    setFormData({ name: '', email: '', review: '' });
                    setRating(0);
                  }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name <span className="text-green-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your name"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email <span className="text-green-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating <span className="text-green-500">*</span>
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
                              <svg className="w-8 h-8 text-green-500 cursor-pointer hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-gray-300 cursor-pointer hover:text-green-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                      <span className="bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                        {rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Text Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review <span className="text-green-500">*</span>
                    </label>
                    <textarea
                      required
                      value={formData.review}
                      onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Write your review here..."
                    />
                  </div>

                  {/* Success Message */}
                  {showSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Success!</span>
                    </div>
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
