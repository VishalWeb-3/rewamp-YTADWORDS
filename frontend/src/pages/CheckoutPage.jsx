import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import PaymentLoadingOverlay from '../components/PaymentLoadingOverlay';
import { isValidLink, getLinkPlaceholder } from '../utils/linkValidator';
import { isValidEmail } from '../utils/emailValidator';
import { triggerPaymentRelay } from '../utils/paymentRelay';
import { toOrderItem, readJson, encodeShareItems } from '../utils/orderItems';
import { formatQuantity } from '../utils/quantity';

const API_BASE = import.meta.env.VITE_API_URL || '';

const CARD_MINIMUM = 35;
const CARD_MAXIMUM = 999;

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
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isProcessing, setIsProcessing] = useState(false);
  const [links, setLinks] = useState({});
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState('');
  const [quote, setQuote] = useState(null);

  const directItem = location.state?.directItem;
  const stateEmail = location.state?.email;

  useEffect(() => {
    if (user?.email && !stateEmail) setEmail(user.email);
    if (stateEmail) setEmail(stateEmail);
  }, [user?.email, stateEmail]);

  const displayItems = useMemo(() => {
    const source = directItem ? [directItem] : cartItems;
    return source.map((item) => ({
      ...item,
      id: item.id || 'direct',
      platform: item.platform || getPlatform(item.serviceType),
      service: item.service || item.serviceName || item.serviceType,
      price: parseFloat(item.price || 0),
    }));
  }, [cartItems, directItem]);

  // Pre-fill links passed from the Get Started page (keyed by platform there)
  useEffect(() => {
    const passed = location.state?.usernames;
    if (!passed) return;
    setLinks((prev) => {
      const next = { ...prev };
      displayItems.forEach((item) => {
        if (!next[item.id] && passed[item.platform]) next[item.id] = passed[item.platform];
      });
      return next;
    });
  }, [location.state, displayItems]);

  // Ask the server for the real prices so the total shown is the total charged
  useEffect(() => {
    if (displayItems.length === 0) return;
    let cancelled = false;
    fetch(`${API_BASE}/api/orders/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: displayItems.map((item) => toOrderItem(item)) }),
    })
      .then(async (res) => ({ ok: res.ok, data: await readJson(res) }))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (ok) {
          setQuote(data);
        } else {
          setQuote(null);
          setError({ message: `${data.error || 'Some items could not be priced'}. Please remove them and add them again.` });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setQuote(null);
        setError({ message: 'Could not load prices. Check your connection and refresh the page.' });
      });
    return () => {
      cancelled = true;
    };
  }, [displayItems]);

  const itemPrice = (item, index) => quote?.items?.[index]?.price ?? item.price;
  const total = quote?.totalAmount ?? displayItems.reduce((sum, item) => sum + item.price, 0);

  // total < $35 or > $999 → crypto only; otherwise card + crypto (card pre-selected)
  const showCardOption = total >= CARD_MINIMUM && total <= CARD_MAXIMUM;
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (!showCardOption) setPaymentMethod('crypto');
  }, [showCardOption]);

  const handleRemove = (id) => {
    if (id === 'direct') {
      navigate('/');
    } else {
      removeFromCart(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError({ message: 'Please enter a valid email address.' });
      return;
    }
    const missing = displayItems.find((item) => !isValidLink(links[item.id], item.platform));
    if (missing) {
      setError({ message: `Please enter a valid ${missing.platform} link for "${missing.service}".` });
      return;
    }

    setIsProcessing(true);
    let isRedirecting = false;
    const method = showCardOption ? paymentMethod : 'crypto';

    try {
      const res = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          items: displayItems.map((item) => toOrderItem(item, links[item.id])),
          paymentMethod: method,
        }),
      });
      const data = await readJson(res);

      if (res.ok && data.paymentUrl) {
        // The cart is cleared on the success page once the payment is confirmed
        sessionStorage.setItem(
          'pendingCheckout',
          JSON.stringify({ externalOrderId: data.externalOrderId, fromCart: !directItem })
        );
        isRedirecting = true;
        if (method === 'card') {
          triggerPaymentRelay(data.paymentUrl);
        } else {
          window.location.href = data.paymentUrl;
        }
        return;
      }

      setError({
        message: data.details || data.error || `Failed to create order (${res.status})`,
        needsLogin: res.status === 409,
      });
    } catch (err) {
      console.error('Checkout error:', err);
      setError({ message: err.message || 'Something went wrong. Please try again.' });
    } finally {
      if (!isRedirecting) {
        setIsProcessing(false);
      }
    }
  };

  const handleShareLink = async () => {
    const url = new URL('/pay', window.location.origin);
    url.searchParams.set('items', encodeShareItems(displayItems.map((item) => toOrderItem(item))));
    const firstLink = links[displayItems[0]?.id];
    if (displayItems.length === 1 && firstLink) url.searchParams.set('username', firstLink);
    if (email) url.searchParams.set('email', email);
    const shareUrl = url.toString();

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Secure Payment Link', url: shareUrl });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setNotice('Payment link copied to clipboard.');
      }
    } catch {
      setNotice(`Share this link: ${shareUrl}`);
    }
  };

  if (displayItems.length === 0) {
    return (
      <Layout>
        <SEO title="Checkout | YoutubeADwords" description="Review your order and pay securely." />
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
        <SEO title="Checkout | YoutubeADwords" description="Review your order and pay securely." />
        <div className="min-h-screen bg-gray-50 py-12 pg-flow">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* ── Left: Form ── */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8" noValidate>
                  <div className="space-y-6">
                    {error && (
                      <div role="alert" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error.message}
                        {error.needsLogin && (
                          <>
                            {' '}
                            <Link to="/login" className="font-bold underline">
                              Log in
                            </Link>
                          </>
                        )}
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* One link per item, so two YouTube items can target different videos */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Where should we deliver?</h3>
                      <div className="space-y-4">
                        {displayItems.map((item) => {
                          const value = links[item.id] || '';
                          const invalid = value && !isValidLink(value, item.platform);
                          return (
                            <div key={item.id}>
                              <label htmlFor={`link-${item.id}`} className="block text-xs text-gray-500 mb-1">
                                {item.service}: {item.platform} username or link
                              </label>
                              <input
                                id={`link-${item.id}`}
                                type="text"
                                value={value}
                                onChange={(e) => setLinks({ ...links, [item.id]: e.target.value })}
                                aria-invalid={invalid ? 'true' : 'false'}
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-brand-red focus:border-transparent transition-colors ${invalid ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder={getLinkPlaceholder(item.platform)}
                              />
                              {invalid && (
                                <p className="text-[10px] text-red-500 font-bold mt-1">Please enter a valid {item.platform} link</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Payment Method ── */}
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                        Payment method
                      </label>

                      {/* Button row: card shown only for $35–$999 */}
                      <div className={`flex gap-3 ${showCardOption ? '' : 'justify-center'}`}>
                        {showCardOption && (
                          <button
                            type="button"
                            id="payment-method-card"
                            aria-pressed={paymentMethod === 'card'}
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
                              aria-hidden="true"
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
                          aria-pressed={paymentMethod === 'crypto'}
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
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                          </svg>
                          Crypto
                        </button>
                      </div>

                      {/* Note shown only when crypto is mandatory */}
                      {!showCardOption && total > 0 && (
                        <p className="mt-2 text-[10px] text-gray-400 text-center">
                          {total < CARD_MINIMUM
                            ? `Card payment available for orders $${CARD_MINIMUM}+`
                            : `Card payment available for orders up to $${CARD_MAXIMUM}`}
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
                      disabled={isProcessing || !quote}
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
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 pg-flow-pass">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order summary</h2>
                  <div className="space-y-4 mb-6">
                    {displayItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center pb-4 border-b border-gray-100"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{item.service}</p>
                          <p className="text-sm text-gray-500">
                            {item.platform} • {formatQuantity(quote?.items?.[index]?.amount ?? item.quantity)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-red">
                            ${itemPrice(item, index).toFixed(2)}
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
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Payment Link
                    </button>
                    {notice && (
                      <p role="status" className="text-xs text-gray-500 text-center break-all">
                        {notice}
                      </p>
                    )}
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
