import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="Page Not Found | YoutubeADwords" description="The page you are looking for does not exist." />
      <div className="min-h-[60vh] bg-gray-50 py-16 flex flex-col items-center justify-center text-center px-4">
        <p className="text-sm font-bold text-brand-red uppercase tracking-widest mb-2">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          to="/"
          className="bg-brand-red text-white font-bold px-8 py-3 rounded-xl hover:bg-[#C62828] transition-colors"
        >
          Browse Services
        </Link>
      </div>
    </Layout>
  );
}
