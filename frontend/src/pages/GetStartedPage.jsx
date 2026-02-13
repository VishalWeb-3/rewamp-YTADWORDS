import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const API_BASE = import.meta.env.VITE_API_URL || '';

// YouTube channel suggestions as user types (like buzzoid.com)
function YouTubeLinkSuggest({ value, onChange, placeholder, className }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const looksLikeUrl = (v) => /^https?:\/\//i.test(v) || /youtube\.com|youtu\.be/i.test(v);

  useEffect(() => {
    const v = (value || '').trim();
    if (!v || v.length < 3 || looksLikeUrl(v)) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/api/youtube/search?q=${encodeURIComponent(v)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(Array.isArray(data) ? data : []);
          if (Array.isArray(data) && data.length > 0) setShowSuggestions(true);
        }
      } catch (err) {
        console.error('YouTube search error', err);
        setSuggestions([]);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value && value.length >= 3 && !looksLikeUrl(value) && suggestions.length > 0 && setShowSuggestions(true)}
        className={className}
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className="w-full flex items-center gap-3 p-3 hover:bg-red-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 text-left"
              onClick={() => {
                onChange(`https://www.youtube.com/channel/${channel.id}`);
                setShowSuggestions(false);
              }}
            >
              <img src={channel.thumbnail} alt={channel.title} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-sm font-semibold text-gray-900 truncate">{channel.title}</span>
                <span className="text-xs text-gray-500 truncate">Channel</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getPlatform(serviceType) {
  if (!serviceType) return 'Other';
  const s = String(serviceType).toLowerCase();
  if (s.includes('youtube')) return 'YouTube';
  if (s.includes('tiktok')) return 'TikTok';
  if (s.includes('google')) return 'Google';
  return 'Other';
}

export default function GetStartedPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state || {};
  const {
    allPackages = null,
    serviceType = 'YouTube Views',
    typeLabels = { regular: 'Regular', fast: 'Fast', ads: 'Ads' },
    quantityKey = 'views',
    unitLabel = 'views',
    initialType = 'regular',
    initialPackage = null,
  } = state;

  const [formData, setFormData] = useState({
    link: '',
    email: '',
    promotions: false,
  });

  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const packages = allPackages?.[selectedType] || [];

  useEffect(() => {
    if (initialPackage && allPackages) {
      setSelectedPackage(initialPackage);
      setSelectedType(initialType);
    } else if (packages.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0]);
    }
  }, [allPackages, initialType, initialPackage]);

  useEffect(() => {
    if (packages.length > 0 && (!selectedPackage || !packages.some((p) => p.price === selectedPackage.price && p[quantityKey] === selectedPackage[quantityKey]))) {
      setSelectedPackage(packages[0]);
    }
  }, [selectedType, allPackages]);

  const handleContinue = () => {
    if (!formData.link || !formData.email || !selectedPackage) return;

    const quantity = selectedPackage[quantityKey];
    const platform = getPlatform(serviceType);
    const serviceLabel = `${serviceType} - ${quantity}`;
    const amount = quantity;
    const price = parseFloat(selectedPackage.price);

    // Direct buy: pass single item to checkout without adding to cart
    navigate('/checkout', {
      state: {
        directItem: {
          id: 'direct',
          platform,
          service: serviceLabel,
          amount: typeof amount === 'string' ? parseInt(amount, 10) || amount : amount,
          price,
        },
        email: formData.email,
        usernames: { [platform]: formData.link },
      },
    });
  };

  const getQuantity = (pkg) => pkg[quantityKey] ?? pkg.views ?? pkg.likes ?? pkg.rereviews ?? pkg.subscribers ?? pkg.hours ?? '';

  const formatPackageLabel = (pkg) => {
    const qty = getQuantity(pkg);
    return `${qty} ${unitLabel}`;
  };

  const isSamePackage = (a, b) => a && b && a.price === b.price && getQuantity(a) === getQuantity(b);

  if (!allPackages || Object.keys(allPackages).length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Select a package first</h1>
            <p className="text-gray-600 mb-6">
              Choose a price on any service page and click &quot;Buy now&quot; to open this form with your selected package.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-brand-red text-white font-bold px-6 py-3 rounded-xl hover:bg-[#C62828] transition-colors"
            >
              Browse Services
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-700">204 users online</span>
                </div>
              </div>

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">Get started</h2>

              <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Link <span className="text-red-500">*</span>
                  </label>
                  <YouTubeLinkSuggest
                    value={formData.link}
                    onChange={(link) => setFormData({ ...formData, link })}
                    placeholder="Paste URL or type channel name for suggestions..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white flex items-center justify-between hover:border-brand-red transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-semibold text-gray-900">
                          {selectedPackage ? formatPackageLabel(selectedPackage) : 'Select package'}
                        </span>
                        <span className="font-bold text-brand-red">
                          ${selectedPackage?.price || '0.00'}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                          {Object.keys(allPackages).length > 1 && (
                            <div className="flex border-b border-gray-200 p-2 gap-2">
                              {Object.keys(allPackages).map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  onClick={() => {
                                    setSelectedType(type);
                                    const list = allPackages[type];
                                    setSelectedPackage(list && list[0] ? list[0] : selectedPackage);
                                  }}
                                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                    selectedType === type ? 'bg-brand-red text-white' : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {typeLabels[type] || type}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="p-2">
                            {(allPackages[selectedType] || []).map((pkg, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setSelectedPackage(pkg);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-3 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                  isSamePackage(selectedPackage, pkg) ? 'bg-red-50 border-2 border-brand-red' : 'border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <span className="font-semibold text-gray-900">{formatPackageLabel(pkg)}</span>
                                  {pkg.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">${pkg.originalPrice}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {pkg.discount && (
                                    <span className="text-xs font-bold bg-brand-red text-white px-2 py-1 rounded">
                                      save {pkg.discount}
                                    </span>
                                  )}
                                  <span className="font-bold text-brand-red">${pkg.price}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="promotions"
                    checked={formData.promotions}
                    onChange={(e) => setFormData({ ...formData, promotions: e.target.checked })}
                    className="w-4 h-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                  />
                  <label htmlFor="promotions" className="text-sm text-gray-700">
                    Send me special promotions and discounts
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!formData.link || !formData.email || !selectedPackage}
                  className="w-full bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-[#C62828] transition-colors text-lg shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                >
                  Continue
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">
                  <svg className="w-16 h-16 text-brand-red" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  They most definitely legit they do exactly what they say they do y'all tap in if your trying to run them numbers up
                </p>
                <div className="mb-4">
                  <p className="font-semibold text-gray-900 text-lg mb-2">Defairo Daghad</p>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Score 4.5</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
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
