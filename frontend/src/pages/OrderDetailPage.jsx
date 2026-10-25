import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders, formatDate, paymentMethodLabel, statusInfo } from '../utils/orders';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [state, setState] = useState('loading'); // loading | ready | missing | error

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setState('missing');
      return;
    }
    let cancelled = false;
    fetchMyOrders()
      .then((orders) => {
        if (cancelled) return;
        const match = orders.find((o) => o.items.some((item) => String(item.id) === String(id)));
        setOrder(match || null);
        setState(match ? 'ready' : 'missing');
      })
      .catch(() => !cancelled && setState('error'));
    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, authLoading]);

  if (state === 'loading') {
    return (
      <Layout>
        <SEO title="Order Details | YoutubeADwords" description="Order details" />
        <p className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-gray-600" role="status">
          Loading order…
        </p>
      </Layout>
    );
  }

  if (state !== 'ready') {
    return (
      <Layout>
        <SEO title="Order Not Found | YoutubeADwords" description="Order details" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {state === 'error' ? 'Could not load this order' : 'Order Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {!isLoggedIn
              ? 'Log in to see your orders.'
              : state === 'error'
                ? 'Please try again in a moment.'
                : "The order you're looking for doesn't exist."}
          </p>
          <Link
            to={isLoggedIn ? '/orders' : '/login'}
            className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
          >
            {isLoggedIn ? 'View All Orders' : 'Log in'}
          </Link>
        </div>
      </Layout>
    );
  }

  const status = statusInfo(order.status);

  return (
    <Layout>
      <SEO title={`Order #${order.id} | YoutubeADwords`} description="Order details" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order.id}</h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{item.service}</h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </p>
                      {item.link && (
                        <p className="truncate">
                          <span className="font-medium">Link:</span> {item.link}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xl font-bold text-brand-red ml-4">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{paymentMethodLabel(order.paymentMethod)}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-red">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/orders"
              className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              View All Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
