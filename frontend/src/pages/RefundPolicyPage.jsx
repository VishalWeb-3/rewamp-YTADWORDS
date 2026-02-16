import React from 'react';
import Layout from '../components/Layout';
import { LegalSection } from '../components/LegalSection';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_SECTIONS = [
  { heading: 'Overview', body: 'This Refund Policy outlines when refunds may be issued and the process for requesting a refund.', listItems: [], subsections: [] },
  { heading: 'Contact Us', body: 'If you have questions or need to request a refund, please contact us through our Contact Us page.', listItems: [], subsections: [] },
];

export default function RefundPolicyPage() {
  const legal = useLegalContent();
  const refund = legal?.refund;
  const title = refund?.title ?? 'Refund Policy';
  const lastUpdated = refund?.lastUpdated ?? 'February 13, 2026';
  const sections = refund?.sections?.length ? refund.sections : DEFAULT_SECTIONS;

  return (
    <Layout>
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
