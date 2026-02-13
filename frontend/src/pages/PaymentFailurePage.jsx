import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function PaymentFailurePage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-16 flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Your payment could not be completed. Please try again or contact support if the problem persists.
        </p>
        <Link
          to="/checkout"
          className="bg-brand-red text-white font-bold px-8 py-3 rounded-xl hover:bg-[#C62828] transition-colors"
        >
          Back to Checkout
        </Link>
      </div>
    </Layout>
  );
}
