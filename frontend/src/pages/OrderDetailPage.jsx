import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCart } from '../contexts/CartContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useCart();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
          <Link
            to="/orders"
            className="px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Orders
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order.id}
              </h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.serviceName || item.serviceType}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.type && (
                        <p>
                          <span className="font-medium">Type:</span> {item.type}
                        </p>
                      )}
                      {item.quantity && (
                        <p>
                          <span className="font-medium">Quantity:</span> {item.quantity}
                        </p>
                      )}
                      {item.url && (
                        <p className="truncate">
                          <span className="font-medium">URL:</span> {item.url}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xl font-bold text-brand-red ml-4">
                    ${item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-brand-red">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          {order.customer && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold text-gray-900">{order.customer.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">
                    {order.paymentMethod === 'card'
                      ? 'Credit/Debit Card'
                      : order.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : 'Cryptocurrency'}
                  </p>
                </div>
                {order.customer.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">
                      {order.customer.address}, {order.customer.city}, {order.customer.country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
