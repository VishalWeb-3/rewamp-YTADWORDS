import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';
import { isValidLink } from '../utils/linkValidator';
import { isValidEmail } from '../utils/emailValidator';
import { triggerPaymentRelay } from '../utils/paymentRelay';

const API_BASE = import.meta.env.VITE_API_URL || '';

const verifiedProfileImages = [
  'https://i.pravatar.cc/100?img=1',
  'https://i.pravatar.cc/100?img=2',
  'https://i.pravatar.cc/100?img=3',
  'https://i.pravatar.cc/100?img=4',
];

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);
const CreditCardIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const CoinsIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function GoogleReviewsUpgradeGeneric() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentUser = user ?? null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const serviceTitle = location.state?.serviceTitle || 'Buy Google Reviews';
  const getStartedReturnPath = location.state?.getStartedReturnPath || '/google-reviews/get-started';

  const [packageData, setPackageData] = useState({
    reviews: 50,
    price: 129.9,
    paymentType: 'one-time',
    reviewType: '5-star',
    originalPrice: 195.0,
    email: '',
    googleMapUrl: '',
    customReviews: null,
    tier: 'high-quality',
    serviceType: 'male',
  });

  const [addOns, setAddOns] = useState({
    verifiedReviewers: false,
    ageGroupTargeting: false,
    genderTargeting: false,
  });

  const [selectedAgeGroups, setSelectedAgeGroups] = useState(['50-60']);
  const [selectedGender, setSelectedGender] = useState(['Female']);

  useEffect(() => {
    if (location.state) {
      setPackageData({
        reviews: location.state.reviews ?? 50,
        price: location.state.price ?? 129.9,
        paymentType: location.state.paymentType || 'one-time',
        reviewType: location.state.reviewType || '5-star',
        originalPrice: location.state.originalPrice ?? 195.0,
        email: location.state.email || '',
        googleMapUrl: location.state.googleMapUrl || '',
        customReviews: location.state.customReviews || null,
        tier: location.state.tier || 'high-quality',
        serviceType: location.state.serviceType || 'male',
      });
    }
  }, [location.state]);

  const toggleAddOn = (addOnName) => {
    setAddOns((prev) => ({ ...prev, [addOnName]: !prev[addOnName] }));
  };

  const toggleAgeGroup = (ageGroup) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(ageGroup) ? prev.filter((age) => age !== ageGroup) : [...prev, ageGroup]
    );
  };

  const toggleGender = (gender) => {
    setSelectedGender((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const calculateTotal = () => {
    let total = packageData.price;
    if (addOns.verifiedReviewers) total += packageData.price * 0.4;
    if (addOns.ageGroupTargeting) total += packageData.price * 0.3;
    if (addOns.genderTargeting) total += packageData.price * 0.3;
    return total;
  };

  const total = calculateTotal();
  const showCardOption = total >= 35;

  useEffect(() => {
    if (!showCardOption && paymentMethod === 'card') {
      setPaymentMethod('crypto');
    }
  }, [showCardOption, paymentMethod]);

  const handleShareLink = async () => {
    const totalAmount = calculateTotal();
    const url = new URL('/pay', window.location.origin);
    url.searchParams.set('amount', String(packageData.reviews));
    url.searchParams.set('price', String(totalAmount.toFixed(2)));
    url.searchParams.set('original', String(packageData.originalPrice.toFixed(2)));
    url.searchParams.set('platform', 'Google Reviews');
    url.searchParams.set('service', serviceTitle);
    url.searchParams.set('ts', String(Date.now()));
    url.searchParams.set('label', 'Shared Google Reviews Order');
    // Pass the Google Map URL so it's pre-filled on the shared page
    if (packageData.googleMapUrl) url.searchParams.set('username', packageData.googleMapUrl);
    if (packageData.email) url.searchParams.set('email', packageData.email);

    const shareUrl = url.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Secure Payment Link',
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Shareable payment link copied to clipboard.');
      } else {
        alert(`Share this link: ${shareUrl}`);
      }
    } catch {
      alert(`Share this link: ${shareUrl}`);
    }
  };

  const handleContinue = async (methodOverride) => {
    const totalAmount = calculateTotal();
    const method = methodOverride || paymentMethod;

    if (!packageData.email || !isValidEmail(packageData.email)) {
      alert('Please enter a valid popular email (gmail, outlook, etc.). Go back to the previous step.');
      navigate(getStartedReturnPath, { state: location.state });
      return;
    }
    if (!packageData.googleMapUrl || !isValidLink(packageData.googleMapUrl, 'Google')) {
      // Allow legacy business names if they don't look like URLs
      const isBusinessName = packageData.googleMapUrl && packageData.googleMapUrl.trim().length >= 2 && !packageData.googleMapUrl.includes('.');
      if (!isBusinessName) {
        alert('Please enter a valid Google Map URL or business name. Go back to the previous step.');
        navigate(getStartedReturnPath, { state: location.state });
        return;
      }
    }

    setIsProcessing(true);
    let isRedirecting = false;

    try {
      const details = {
        verifiedReviewers: addOns.verifiedReviewers,
        ageGroups: addOns.ageGroupTargeting ? selectedAgeGroups : null,
        genders: addOns.genderTargeting ? selectedGender : null,
        customReviews: packageData.customReviews,
        reviewType: packageData.reviewType,
        tier: packageData.tier,
        serviceType: packageData.serviceType,
      };

      const items = [
        {
          platform: 'Google Reviews',
          service: serviceTitle,
          amount: packageData.reviews,
          price: totalAmount,
          username: packageData.googleMapUrl,
          details,
          tier: packageData.tier,
        },
      ];

      const response = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: currentUser ? currentUser.id : null,
          email: packageData.email,
          usernames: { 'Google Reviews': packageData.googleMapUrl },
          items,
          paymentMethod: method,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (data.paymentUrl) {
          isRedirecting = true;
          if (method === 'card') {
            triggerPaymentRelay(data.paymentUrl);
          } else {
            window.location.href = data.paymentUrl;
          }
          return;
        }
        if (!data.paymentUrl) {
          alert('Order created successfully');
          navigate('/orders');
          return;
        }
      }

      const text = await response.text();
      let errorMessage = 'Failed to create order';
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorMessage;
        if (errorData.details) errorMessage = `${errorMessage} - ${errorData.details}`;
      } catch {
        errorMessage = text || `Server Error (${response.status})`;
      }
      alert(`Error: ${errorMessage}`);
    } catch (error) {
      console.error('Order Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      if (!isRedirecting) {
        setIsProcessing(false);
      }
    }
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case 'one-time':
        return 'Pay Once';
      case 'recurring':
        return 'Monthly Plan';
      case 'drip':
        return '90-Day Drip Reviews';
      default:
        return 'Pay Once';
    }
  };

  const getReviewTypeLabel = (type) => {
    return type === '5-star' ? '5-Star Reviews' : 'Custom Written Reviews';
  };

  return (
    <>
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Link
              to={getStartedReturnPath}
              state={location.state}
              className="inline-flex text-lg items-center text-gray-700 hover:text-gray-900 font-medium"
            >
              <span className="mr-1">←</span>
              Back
            </Link>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Make Your Order Even More Powerful
              </h1>
              <p className="text-gray-600 text-lg">
                89% of our customers choose at least one add-on to multiply the impact of their purchase.
                Add them now to get faster, more targeted results - all with a single click.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {packageData.serviceType !== 'local-guide' && (
                <div
                  className={`bg-white border-2 rounded-lg p-6 transition-colors ${addOns.verifiedReviewers ? 'border-green-500 border-l-4' : 'border-gray-200'
                    }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Verified Reviewers (+40%)</h3>
                        <div className="flex -space-x-2">
                          {verifiedProfileImages.slice(0, 4).map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt=""
                              className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-100"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Reviews from trusted Google Local Guides with proven history &amp; high credibility
                      </p>
                      <div className="flex items-center justify-left gap-2 text-green-600">
                        <CheckIcon />
                        <span className="text-sm font-bold">Google Local Guides - Official Badge</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:ml-6">
                      <button
                        onClick={() => toggleAddOn('verifiedReviewers')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${addOns.verifiedReviewers ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addOns.verifiedReviewers ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {packageData.serviceType !== 'age-group' && (
                <div
                  className={`bg-white border-2 rounded-lg p-6 transition-colors ${addOns.ageGroupTargeting ? 'border-green-500 border-l-4' : 'border-gray-200'
                    }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Age Group Targeting (+30%)</h3>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Choose specific age ranges where you want your reviews to appear most frequently.
                      </p>
                      {addOns.ageGroupTargeting && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['18-24', '25-34', '35-44', '45-54', '50-60'].map((age) => (
                            <button
                              key={age}
                              onClick={() => toggleAgeGroup(age)}
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedAgeGroups.includes(age)
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                            >
                              {age}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 sm:ml-6">
                      <button
                        onClick={() => toggleAddOn('ageGroupTargeting')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${addOns.ageGroupTargeting ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addOns.ageGroupTargeting ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gender Targeting - shown on all Google Reviews pages */}
              {(
                <div
                  className={`bg-white border-2 rounded-lg p-6 transition-colors ${addOns.genderTargeting ? 'border-green-500 border-l-4' : 'border-gray-200'
                    }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">Gender Targeting (+30%)</h3>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Focus your reviews on a specific gender to better match your target audience.
                      </p>
                      {addOns.genderTargeting && (
                        <div className="flex gap-2 mt-2">
                          {['Male', 'Female', 'Other'].map((gender) => (
                            <button
                              key={gender}
                              onClick={() => toggleGender(gender)}
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${selectedGender.includes(gender)
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'bg-gray-100 text-gray-700 border-gray-300'
                                }`}
                            >
                              {gender}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 sm:ml-6">
                      <button
                        onClick={() => toggleAddOn('genderTargeting')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${addOns.genderTargeting ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${addOns.genderTargeting ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Order Summary</h2>
                  <p className="text-gray-600">
                    {packageData.reviews} {getReviewTypeLabel(packageData.reviewType)} •{' '}
                    {getPaymentTypeLabel(packageData.paymentType)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">
                    Original: ${Number(packageData.originalPrice).toFixed(2)}
                  </p>
                  <p className="text-2xl font-bold text-green-600">Total: ${total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row gap-4">
                {showCardOption && (
                  <button
                    type="button"
                    onClick={() => handleContinue('card')}
                    disabled={isProcessing}
                    className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${isProcessing
                      ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                      : 'border-green-600 bg-green-50 text-green-700 hover:border-green-700'
                      }`}
                  >
                    <CreditCardIcon />
                    <span className="font-semibold">
                      {isProcessing ? 'Processing…' : 'Pay with Card'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleContinue('crypto')}
                  disabled={isProcessing}
                  className={`flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 transition-colors ${isProcessing
                    ? 'border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed opacity-60'
                    : 'border-amber-500 bg-amber-50 text-amber-700 hover:border-amber-600'
                    }`}
                >
                  <CoinsIcon />
                  <span className="font-semibold">
                    {isProcessing ? 'Processing…' : 'Pay with Crypto'}
                  </span>
                </button>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">
                  Want someone else to pay? Generate a shareable payment link instead.
                </p>
                <button
                  type="button"
                  onClick={handleShareLink}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 hover:bg-white hover:border-brand-red hover:text-brand-red transition-all"
                >
                  Share payment link
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <PaymentLoadingOverlay isOpen={isProcessing} />
    </>
  );
}
