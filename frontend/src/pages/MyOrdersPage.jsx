import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { fetchMyOrders, formatDate, paymentMethodLabel, statusInfo } from '../utils/orders';

export default function MyOrdersPage() {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchMyOrders()
      .then((data) => !cancelled && setOrders(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, authLoading]);

  const filteredOrders = orders.filter((order) => filter === 'all' || statusInfo(order.status).key === filter);

  const renderEmpty = (title, message, cta) => (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <svg
        className="w-24 h-24 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>
      {cta}
    </div>
  );

  let content;
  if (loading || authLoading) {
    content = <p className="text-gray-600" role="status">Loading your orders…</p>;
  } else if (!isLoggedIn) {
    content = renderEmpty(
      'Log in to see your orders',
      'Orders placed as a guest appear here once you sign up with the same email address.',
      <div className="flex justify-center gap-3">
        <Link to="/login" className="inline-block px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors">
          Log in
        </Link>
        <Link to="/signup" className="inline-block px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
          Sign up
        </Link>
      </div>
    );
  } else if (error) {
    content = renderEmpty('Something went wrong', error, null);
  } else if (filteredOrders.length === 0) {
    content = renderEmpty(
      'No orders found',
      filter === 'all' ? "You haven't placed any orders yet." : `You don't have any ${filter} orders.`,
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
      >
        Start Shopping
      </Link>
    );
  } else {
    content = (
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const status = statusInfo(order.status);
          return (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>{status.label}</span>
                  </div>
                  <p className="text-gray-600 text-sm">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-red">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.service}</h4>
                        <p className="text-sm text-gray-600">
                          {item.platform} • {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900 ml-4">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Payment Method:</span> {paymentMethodLabel(order.paymentMethod)}
                  </p>
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 text-brand-red font-semibold hover:bg-red-50 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Layout>
      <SEO title="My Orders | YoutubeADwords" description="Track the status of your YoutubeADwords orders." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
          <Link
            to="/"
            className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
          >
            Browse Services
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200" role="tablist">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Awaiting payment' },
            { id: 'processing', label: 'Processing' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => setFilter(tab.id)}
              className={`pb-4 px-4 font-medium transition-colors ${filter === tab.id
                ? 'text-brand-red border-b-2 border-brand-red'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {content}
      </div>
    </Layout>
  );
}
