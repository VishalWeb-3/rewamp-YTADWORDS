import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { LegalSection } from '../components/LegalSection';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_SECTIONS = [
  { heading: 'Agreement to Terms', body: 'By accessing and using YoutubeADwords\'s website and services, you accept and agree to be bound by these terms.', listItems: [], subsections: [] },
  { heading: 'Service Description', body: 'YoutubeADwords provides social media growth services. We do not guarantee specific results.', listItems: [], subsections: [] },
  { heading: 'Contact Information', body: 'If you have any questions, please contact us through our Contact Us page.', listItems: [], subsections: [] },
];

export default function TermsPage() {
  const legal = useLegalContent();
  const terms = legal?.terms;
  const title = terms?.title ?? 'Terms of Service';
  const lastUpdated = terms?.lastUpdated ?? 'February 13, 2026';
  const sections = terms?.sections?.length ? terms.sections : DEFAULT_SECTIONS;

  return (
    <Layout>
      <SEO
        title="Terms of Service | YoutubeADwords"
        description="Read the YoutubeADwords Terms of Service. By using our platform, you agree to our terms for YouTube, TikTok, and Google Ads growth services."
      />
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {title}
            </h1>
            <p className="text-gray-600 text-sm">Last updated: {lastUpdated}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-6">
            {sections.map((section, i) => (
              <LegalSection key={i} section={section} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
