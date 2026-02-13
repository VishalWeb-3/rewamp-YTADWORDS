import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function PaymentSuccessPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Thank you for your order. Your payment has been received and your order is being processed.
        </p>
        <Link
          to="/orders"
          className="bg-brand-red text-white font-bold px-8 py-3 rounded-xl hover:bg-[#C62828] transition-colors"
        >
          View My Orders
        </Link>
      </div>
    </Layout>
  );
}
