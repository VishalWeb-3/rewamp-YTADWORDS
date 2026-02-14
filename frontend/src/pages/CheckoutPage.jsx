import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

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
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
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
  const stateUsernames = location.state?.usernames || {};

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
        amount: typeof directItem.amount === 'number' ? directItem.amount : parseInt(String(directItem.amount), 10) || directItem.amount,
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
    const unique = [...new Set(displayItems.map((item) => item.platform))];
    return unique;
  }, [displayItems]);

  const total = useMemo(() => {
    if (urlPlatform && urlService && urlPrice) return parseFloat(urlPrice);
    return displayItems.reduce((sum, item) => sum + item.price, 0);
  }, [displayItems, urlPlatform, urlService, urlPrice]);

  const handleRemove = (id) => {
    if (id === 'temp' || id === 'direct') {
      navigate('/');
    } else {
      removeFromCart(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);

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
          paymentMethod: 'card',
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

      alert(data.error || data.details || 'Failed to create order');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
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
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Platform usernames</h3>
                    <div className="space-y-4">
                      {platforms.map((platform) => (
                        <div key={platform}>
                          <label className="block text-xs text-gray-500 mb-1">{platform} username or link</label>
                          <input
                            type="text"
                            value={usernames[platform] || ''}
                            onChange={(e) => setUsernames({ ...usernames, [platform]: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-red focus:border-transparent"
                            placeholder={platform === 'YouTube' ? 'youtube.com/watch?v=...' : `@${platform.toLowerCase()}_user`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-brand-red text-white font-bold py-4 rounded-xl hover:bg-[#C62828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)} Securely`}
                  </button>
                </div>
              </form>
            </div>

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
                        <p className="text-sm text-gray-500">{item.platform} • {item.amount}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-red">${item.price.toFixed(2)}</span>
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
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Secure payment powered by Uplef
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
