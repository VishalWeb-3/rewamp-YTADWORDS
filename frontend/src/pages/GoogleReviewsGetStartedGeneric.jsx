import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { isValidLink } from '../utils/linkValidator';
import { isValidEmail } from '../utils/emailValidator';

const MailIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const upgradePath = '/google-reviews/upgrade';

export default function GoogleReviewsGetStartedGeneric() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceType = location.state?.serviceType || 'male';
  const serviceTitle = location.state?.serviceTitle || 'Buy Google Reviews';
  const pricingPath = location.state?.pricingPath || '/buy-male-google-reviews';

  const [packageData, setPackageData] = useState({
    reviews: 50,
    price: 129.9,
    paymentType: 'one-time',
    reviewType: '5-star',
    originalPrice: 195.0,
    tier: 'high-quality',
  });

  const [formData, setFormData] = useState({
    email: '',
    googleMapUrl: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    googleMapUrl: '',
  });

  const [isValidating, setIsValidating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const autocompleteServiceRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      setPackageData({
        reviews: location.state.reviews ?? 50,
        price: location.state.price ?? 129.9,
        paymentType: location.state.paymentType || 'one-time',
        reviewType: location.state.reviewType || '5-star',
        originalPrice: location.state.originalPrice ?? 195.0,
        tier: location.state.tier || 'high-quality',
      });
    }
  }, [location.state]);

  useEffect(() => {
    const loadGooglePlacesAPI = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        return true;
      }
      return false;
    };

    if (loadGooglePlacesAPI()) return;

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';
    if (!apiKey) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => loadGooglePlacesAPI();
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const validateGoogleMapUrl = (url) => {
    if (!url || url.trim() === '') {
      return { valid: false, error: 'Google Map URL is required' };
    }
    if (isValidLink(url, 'Google')) {
      return { valid: true, error: '' };
    }
    // If it's not a valid link, check if it's at least a name (existing legacy support)
    if (url.trim().length >= 2 && !url.includes('.')) {
      return { valid: true, error: '' };
    }
    return { valid: false, error: 'Please enter a valid Google Maps URL or business name' };
  };

  const fetchSuggestions = async (input) => {
    if (!autocompleteServiceRef.current || input.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (input.match(/^https?:\/\//)) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      autocompleteServiceRef.current.getPlacePredictions(
        { input, types: ['establishment'], componentRestrictions: { country: [] } },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } catch {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    if (formData.googleMapUrl && !formData.googleMapUrl.match(/^https?:\/\//)) {
      const timer = setTimeout(() => fetchSuggestions(formData.googleMapUrl), 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [formData.googleMapUrl]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'googleMapUrl') {
      setSelectedPlace(null);
    }
  };

  const handleSelectSuggestion = (place) => {
    setFormData((prev) => ({ ...prev, googleMapUrl: place.description }));
    setSelectedPlace(place);
    setSuggestions([]);
    setShowSuggestions(false);
    setErrors((prev) => ({ ...prev, googleMapUrl: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      if (value && !isValidEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    } else if (name === 'googleMapUrl') {
      const validation = validateGoogleMapUrl(value);
      setErrors((prev) => ({ ...prev, googleMapUrl: validation.error }));
    }
  };

  const handleNext = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      return;
    }
    const urlValidation = validateGoogleMapUrl(formData.googleMapUrl);
    if (!urlValidation.valid) {
      setErrors((prev) => ({ ...prev, googleMapUrl: urlValidation.error }));
      return;
    }

    setIsValidating(true);
    setIsValidating(false);

    navigate(upgradePath, {
      state: {
        ...packageData,
        ...formData,
        platform: 'Google Reviews',
        service: serviceTitle,
        serviceType,
        serviceTitle,
        pricingReturnPath: pricingPath,
        getStartedReturnPath: location.pathname,
      },
    });
  };

  const getPaymentTypeLabel = (type) => {
    switch (type) {
      case 'one-time':
        return 'One-time Payment';
      case 'recurring':
        return 'Recurring Subscription';
      case 'drip':
        return '90-Day Drip Reviews';
      default:
        return 'One-time Payment';
    }
  };

  const getReviewTypeLabel = (type) => {
    return type === '5-star' ? '5-Star Reviews' : 'Custom Written Reviews';
  };

  return (
    <Layout>
      <SEO title="Get Started | YoutubeADwords" description="Tell us where to deliver your Google reviews." />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Link
            to={pricingPath}
            className="inline-flex text-lg items-center text-gray-700 hover:text-gray-900 font-medium"
          >
            <span className="mr-1">←</span>
            Back
          </Link>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Your details</h2>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Enter your email address"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="relative">
                  <label htmlFor="googleMapUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Google Map URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon />
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      id="googleMapUrl"
                      name="googleMapUrl"
                      value={formData.googleMapUrl}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      placeholder="Enter business name or Google Maps URL"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 ${errors.googleMapUrl ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />

                    {showSuggestions && suggestions.length > 0 && (
                      <div
                        ref={suggestionsRef}
                        className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.place_id}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-gray-900">
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-sm text-gray-500">
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Start typing your business name to search, or paste a Google Maps URL
                  </p>
                  {errors.googleMapUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.googleMapUrl}</p>
                  )}
                  {selectedPlace && !errors.googleMapUrl && (
                    <p className="mt-1 text-sm text-green-600">✓ Valid Google Maps location selected</p>
                  )}
                  {formData.googleMapUrl &&
                    !errors.googleMapUrl &&
                    !selectedPlace &&
                    isValidLink(formData.googleMapUrl, 'Google') && (
                      <p className="mt-1 text-sm text-green-600">✓ Valid Google Maps URL format</p>
                    )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={
                    !formData.email ||
                    !formData.googleMapUrl ||
                    isValidating ||
                    !!errors.email ||
                    !!errors.googleMapUrl
                  }
                  className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 hover:bg-green-600"
                >
                  {isValidating ? 'Validating...' : 'Next'}
                </button>
              </div>

              <div className="lg:pl-8">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{serviceTitle}</h3>
                  <div className="mb-4">
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {getPaymentTypeLabel(packageData.paymentType)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg text-gray-700">
                      <span className="text-green-600 font-semibold">{packageData.reviews}</span>{' '}
                      {getReviewTypeLabel(packageData.reviewType)}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ${Number(packageData.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
