import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';

const API_BASE = import.meta.env.VITE_API_URL || '';

const CARD_MINIMUM = 35; // same as famoid.com – card only available for orders >= $35

function isValidEmail(value) {
  const v = (value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// Derive platform from serviceType
function getPlatform(serviceType) {
  if (!serviceType) return 'Other';
  const s = String(serviceType).toLowerCase();
  if (s.includes('youtube')) return 'YouTube';
  if (s.includes('tiktok')) return 'TikTok';
  if (s.includes('google')) return 'Google';
  return 'Other';
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const [isProcessing, setIsProcessing] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [email, setEmail] = useState(user?.email || '');

  const urlPlatform = query.get('platform');
  const urlService = query.get('service');
  const urlAmount = query.get('amount');
  const urlPrice = query.get('price');
  const directItem = location.state?.directItem;
  const stateEmail = location.state?.email;

  useEffect(() => {
    if (user?.email && !directItem) setEmail(user.email);
    if (directItem && stateEmail) setEmail(stateEmail);
  }, [user?.email, directItem, stateEmail]);

  useEffect(() => {
    if (directItem && location.state?.usernames && Object.keys(location.state.usernames).length > 0) {
      setUsernames(location.state.usernames);
    }
  }, [directItem]);

  const displayItems = useMemo(() => {
    if (directItem) {
      return [{
        id: directItem.id || 'direct',
        platform: directItem.platform,
        service: directItem.service,
        amount: typeof directItem.amount === 'number'
          ? directItem.amount
          : parseInt(String(directItem.amount), 10) || directItem.amount,
        price: parseFloat(directItem.price || 0),
      }];
    }
    if (urlPlatform && urlService) {
      return [{
        id: 'temp',
        platform: urlPlatform,
        service: urlService,
        amount: parseInt(urlAmount || '0'),
        price: parseFloat(urlPrice || '0'),
      }];
    }
    return cartItems.map((item) => ({
      id: item.id,
      platform: item.platform || getPlatform(item.serviceType),
      service: item.serviceName || item.serviceType,
      amount: parseInt(item.quantity || item.views || '0'),
      price: parseFloat(item.price || 0),
    }));
  }, [cartItems, urlPlatform, urlService, urlAmount, urlPrice, directItem]);

  const platforms = useMemo(() => {
    return [...new Set(displayItems.map((item) => item.platform))];
  }, [displayItems]);

  const total = useMemo(() => {
    if (urlPlatform && urlService && urlPrice) return parseFloat(urlPrice);
    return displayItems.reduce((sum, item) => sum + item.price, 0);
  }, [displayItems, urlPlatform, urlService, urlPrice]);

  // --------------------------------------------------
  // Payment method logic (mirrors famoid.com exactly)
  //   total < $35   → crypto only (card hidden)
  //   total >= $35  → card + crypto (card pre-selected)
  // --------------------------------------------------
  const showCardOption = total >= CARD_MINIMUM;

  const [paymentMethod, setPaymentMethod] = useState(
    showCardOption ? 'card' : 'crypto'
  );

  // Keep payment method in sync when total crosses the $35 threshold
  useEffect(() => {
    if (!showCardOption) {
      setPaymentMethod('crypto');
    } else if (paymentMethod !== 'card' && paymentMethod !== 'crypto') {
      setPaymentMethod('card');
    }
  }, [showCardOption]);

  const handleRemove = (id) => {
    if (id === 'temp' || id === 'direct') {
      navigate('/');
    } else {
      removeFromCart(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

    // Always use crypto when card option is not available
    const method = showCardOption ? paymentMethod : 'crypto';

    try {
      const items = displayItems.map((item) => ({
        platform: item.platform,
        service: item.service,
        amount: item.amount,
        price: item.price,
        username: usernames[item.platform],
      }));

      const res = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user?.id ?? null,
          email,
          usernames,
          items,
          paymentMethod: method,
        }),
      });

      const data = await res.json();

      if (res.ok && data.paymentUrl) {
        if (!location.state?.directItem && !urlPlatform) clearCart();
        window.location.href = data.paymentUrl;
        return;
      }

      if (res.ok && !data.paymentUrl) {
        if (!location.state?.directItem && !urlPlatform) clearCart();
        alert('Order created successfully');
        navigate('/orders');
        return;
      }

      const errorMsg = data.details || data.error || 'Failed to create order';
      alert(errorMsg);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareLink = async () => {
    const firstItem = displayItems[0];
    const url = new URL('/pay', window.location.origin);
    url.searchParams.set('amount', String(firstItem.amount));
    url.searchParams.set('price', String(total.toFixed(2)));
    url.searchParams.set('original', String((total * 1.5).toFixed(2)));
    url.searchParams.set('platform', firstItem.platform);
    url.searchParams.set('service', firstItem.service);
    url.searchParams.set('ts', String(Date.now()));
    url.searchParams.set('label', 'Shared Order');
    // Pass the username/link so it's pre-filled on the shared page
    const usernameVal = usernames[firstItem.platform] || firstItem.username || '';
    if (usernameVal) url.searchParams.set('username', usernameVal);
    if (email) url.searchParams.set('email', email);

    const shareUrl = url.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Secure Payment Link',
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        alert('Payment link copied to clipboard.');
      } else {
        alert(`Share this link: ${shareUrl}`);
      }
    } catch {
      alert(`Share this link: ${shareUrl}`);
    }
  };

  if (displayItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Add services from any service page, or click Buy now to checkout directly.
          </p>
          <Link
            to="/"
            className="bg-brand-red text-white font-bold px-6 py-3 rounded-xl hover:bg-[#C62828] transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Left: Form ── */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="space-y-6">

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Platform usernames */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Platform usernames</h3>
                      <div className="space-y-4">
                        {platforms.map((platform) => (
                          <div key={platform}>
                            <label className="block text-xs text-gray-500 mb-1">
                              {platform} username or link
                            </label>
                            <input
                              type="text"
                              value={usernames[platform] || ''}
                              onChange={(e) =>
                                setUsernames({ ...usernames, [platform]: e.target.value })
                              }
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                              placeholder={
                                platform === 'YouTube'
                                  ? 'youtube.com/watch?v=...'
                                  : `@${platform.toLowerCase()}_user`
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Payment Method ── */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                        Payment method
                      </label>

                      {/* Button row: card shown only when total >= $35 */}
                      <div className={`flex gap-3 ${showCardOption ? '' : 'justify-center'}`}>
                        {showCardOption && (
                          <button
                            type="button"
                            id="payment-method-card"
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 min-h-[48px] rounded-xl border-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card'
                              ? 'border-brand-red bg-red-50 text-brand-red'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                              }`}
                          >
                            {/* Credit card icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                              <line x1="1" y1="10" x2="23" y2="10" />
                            </svg>
                            Card
                          </button>
                        )}

                        <button
                          type="button"
                          id="payment-method-crypto"
                          onClick={() => setPaymentMethod('crypto')}
                          className={`${showCardOption ? 'flex-1' : 'w-full'} min-h-[48px] rounded-xl border-2 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${paymentMethod === 'crypto'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          {/* Coin / crypto icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                          </svg>
                          Crypto
                        </button>
                      </div>

                      {/* Note shown only when total < $35 */}
                      {!showCardOption && total > 0 && (
                        <p className="mt-2 text-[10px] text-gray-400 text-center">
                          Card payment available for orders ${CARD_MINIMUM}+
                        </p>
                      )}

                      {/* Crypto info banner */}
                      {paymentMethod === 'crypto' && (
                        <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-relaxed">
                          🔒 Pay with BTC, ETH, USDT &amp; 100+ cryptocurrencies via Cryptomus. Your order is confirmed once payment is received on-chain.
                        </p>
                      )}
                    </div>

                    {/* ── Submit ── */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={`w-full text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg ${paymentMethod === 'crypto' || !showCardOption
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : 'bg-brand-red hover:bg-[#C62828]'
                        }`}
                    >
                      {isProcessing
                        ? 'Processing...'
                        : (paymentMethod === 'crypto' || !showCardOption)
                          ? `Pay $${total.toFixed(2)} with Crypto`
                          : `Pay $${total.toFixed(2)} Securely`}
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Right: Order Summary ── */}
              <div>
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order summary</h2>
                  <div className="space-y-4 mb-6">
                    {displayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center pb-4 border-b border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.service}</p>
                          <p className="text-sm text-gray-500">
                            {item.platform} • {item.amount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-red">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-brand-red">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-400 text-center">
                    {paymentMethod === 'crypto' || !showCardOption
                      ? 'Secure crypto payment powered by Cryptomus'
                      : 'Secure card payment powered by Uplef'}
                  </p>

                  {/* Badge row */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 rounded-full px-2 py-0.5 font-semibold">
                      🔒 Secure
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 font-semibold">
                      ✓ Encrypted
                    </span>
                    {(paymentMethod === 'crypto' || !showCardOption) && (
                      <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5 font-semibold">
                        ₿ Crypto
                      </span>
                    )}
                  </div>

                  {/* Share Option */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                      Need someone else to pay?
                    </p>
                    <button
                      type="button"
                      onClick={handleShareLink}
                      className="w-full h-11 rounded-xl border-2 border-gray-200 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:border-brand-red hover:text-brand-red transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Payment Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      <PaymentLoadingOverlay isOpen={isProcessing} />
    </>
  );
}
