import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { usePricingPackages } from '../contexts/ContentContext';

const appsDownloadPackagesFallback = {
    regular: [
        { installs: '5k', price: '300', originalPrice: null, discount: null },
        { installs: '10k', price: '500', originalPrice: null, discount: null },
        { installs: '50k', price: '2500', originalPrice: null, discount: null },
        { installs: '100k', price: '3000', originalPrice: null, discount: null },
        { installs: 'Custom', price: 'Contact for Price', originalPrice: null, discount: null },
    ],
    fast: [
        { installs: '5k', price: '600', originalPrice: null, discount: null },
        { installs: '10k', price: '1000', originalPrice: null, discount: null },
        { installs: '50k', price: '4000', originalPrice: null, discount: null },
        { installs: '100k', price: 'Custom Pricing', originalPrice: null, discount: null },
        { installs: 'Custom', price: 'Contact for Price', originalPrice: null, discount: null },
    ],
};

const features = [
    { label: 'Real & Organic App Installs', icon: 'check' },
    { label: 'High Quality', icon: 'check' },
    { label: 'Instant start', icon: 'check' },
    { label: 'Refill Guaranteed', icon: 'check' },
    { label: 'No drops', icon: 'check' },
    { label: 'Privacy and safety', icon: 'check' },
];

export default function BuyGoogleAppsDownloadPage() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const appsDownloadPackages = usePricingPackages('buy-google-apps-download', appsDownloadPackagesFallback);
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
    const packages = appsDownloadPackages ? appsDownloadPackages[activeTab] : [];

    const handleAddToCart = (pkg) => {
        addToCart({
            serviceType: 'Google Apps Download',
            serviceName: `Google Apps Download - ${pkg.installs}`,
            type: activeTab === 'regular' ? 'Worldwide (WW) Installs' : 'Tier-1 Country Installs (USA, UK, Canada, etc.)',
            quantity: pkg.installs,
            price: pkg.price,
            installs: pkg.installs,
        });
    };

    const faqs = [
        {
            question: 'How quickly will I receive my Google app downloads?',
            answer: 'Delivery times vary depending on the package you choose. Regular downloads typically start within a few hours, while Niche Targeted downloads begin immediately. All packages are designed to deliver installs gradually to ensure natural growth patterns.',
        },
        {
            question: 'Are the downloads real and from real users?',
            answer: 'Yes! YoutubeADwords provides authentic app downloads from real users. Our installs come from legitimate app discovery methods, ensuring they appear organic and natural. We never use bots or fake accounts, which is why our installs help improve your app store ranking.',
        },
        {
            question: 'Will buying downloads get my app banned?',
            answer: 'No, our service is completely safe. We use legitimate methods that comply with Google Play Store terms of service. Our installs come from real users through organic discovery methods, so there\'s no risk to your app.',
        },
        {
            question: 'Can I choose which country the downloads come from?',
            answer: 'Yes! Our system automatically analyzes your app and suggests the most suitable country for your target audience. You can also manually select a specific country when placing your order to ensure the downloads align with your app\'s target demographic.',
        },
        {
            question: 'What happens if downloads drop after delivery?',
            answer: 'We offer a refill guarantee on all our packages. If you experience any drops in installs, we will refill them at no additional cost. Our high-quality installs have excellent retention rates, but we stand behind our service with this guarantee.',
        },
        {
            question: 'Can I buy downloads for multiple apps at once?',
            answer: 'Absolutely! You can purchase downloads for as many apps as you like. Many of our customers buy downloads for every app they launch to maintain consistent growth and ranking across their portfolio.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenFAQIndex(openFAQIndex === index ? null : index);
    };

    return (
        <Layout>
            <SEO
                title="Buy Google Apps Download | YoutubeADwords"
                description="Buy real Google app installs instantly. Boost your app store ranking with YoutubeADwords' authentic, high-quality app download packages."
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
                                src="/pricepage.png"
                                alt="Buy Google Apps Download"
                                className="w-[200px] h-auto object-cover bg-transparent"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 flex items-center gap-3 flex-wrap">
                                Buy Google Apps Download{' '}
                                <span className="bg-[#4285F4] text-white px-4 py-2 rounded-lg text-2xl lg:text-3xl font-bold">
                                    Instantly
                                </span>
                            </h1>
                            <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                                YoutubeADwords is the safest way to buy Google Apps Download with delivery in just a few minutes. We offer multiple packages with real users for all different needs - choose wisely!
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Pricing Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
                        {/* Tabs */}
                        <div className="flex gap-4 mb-6 border-b border-gray-200">
                            {[
                                { id: 'regular', label: 'Worldwide (WW) Installs' },
                                { id: 'fast', label: 'Tier-1 Country Installs (USA, UK, Canada, etc.)' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSelectedPackageIndex(null);
                                    }}
                                    className={`pb-3 px-2 font-medium text-sm lg:text-base transition-colors ${activeTab === tab.id
                                        ? 'text-gray-900 border-b-2 border-[#4285F4]'
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
                                <span className="text-[#4285F4] font-semibold">{activeTab === 'regular' ? 'Regular' : 'Niche Targeted'} Google Apps Download</span> packages for best app store performance.
                            </p>
                        </div>

                        {/* View Packages Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                            {packages.map((pkg, index) => {
                                const isSelected = selectedPackageIndex === index;
                                const isContact = pkg.price === 'Contact for Price' || pkg.price === 'Custom Pricing';
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPackageIndex(index)}
                                        className={`rounded-full transition-colors cursor-pointer flex items-center ${isSelected ? 'bg-[#4285F4] p-[2px]' : 'bg-gray-50 hover:border-blue-500/50 p-0'
                                            }`}
                                    >
                                        <div className={`px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center min-w-[70px] sm:min-w-[90px] bg-white flex-shrink-0 ${isSelected ? 'border-2 border-[#4285F4] border-r-0 rounded-l-full' : 'rounded-l-full'
                                            }`}>
                                            <div className="text-lg sm:text-2xl font-bold text-gray-900 leading-none">{pkg.installs}</div>
                                            <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">installs</div>
                                        </div>
                                        <div className={`flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center rounded-r-full ${isSelected ? 'bg-[#4285F4]' : ''}`}>
                                            <div className={`font-bold ${isContact ? 'text-xs sm:text-sm' : 'text-base sm:text-xl'} ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                {isContact ? pkg.price : `$${pkg.price}`}
                                            </div>
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
                                        if (selectedPkg.price === 'Contact for Price') {
                                            navigate('/contact');
                                        } else {
                                            navigate('/get-started', {
                                                state: {
                                                    allPackages: appsDownloadPackages,
                                                    serviceType: 'Google Apps Download',
                                                    typeLabels: { regular: 'Worldwide (WW) Installs', fast: 'Tier-1 Country Installs (USA, UK, Canada, etc.)' },
                                                    quantityKey: 'installs',
                                                    unitLabel: 'installs',
                                                    initialType: activeTab,
                                                    initialPackage: selectedPkg,
                                                },
                                            });
                                        }
                                    }
                                }}
                                disabled={selectedPackageIndex === null}
                                className="flex-1 bg-[#4285F4] text-white font-bold py-4 rounded-xl hover:bg-[#3367D6] transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                            >
                                {selectedPackageIndex !== null && packages[selectedPackageIndex].price === 'Contact for Price' ? 'Contact Us' : 'Buy now'}
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
                                        className="w-5 h-5 text-[#4285F4] flex-shrink-0"
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

                {/* FAQ Section */}
                <div className="mt-12 lg:mt-16">
                    <div className="max-w-4xl mx-auto">
                        {/* Heading */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
                            Frequently Asked{' '}
                            <span className="text-[#4285F4] relative">
                                Questions
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4285F4]" />
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
                                                <svg className="w-6 h-6 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                </svg>
                                            ) : (
                                                <svg className="w-6 h-6 text-[#4285F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>
        </Layout>
    );
}
