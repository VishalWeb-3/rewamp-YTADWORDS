import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { LegalSection } from '../components/LegalSection';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_SECTIONS = [
  { heading: 'Introduction', body: 'YoutubeADwords ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.', listItems: [] },
  { heading: 'Information We Collect', body: 'We may collect personal information including name, contact info, payment info, and order history. We automatically collect device and usage information.', listItems: [] },
  { heading: 'How We Use Your Information', body: 'We use the information to process orders, provide support, improve services, detect fraud, and comply with legal obligations.', listItems: ['Process and fulfill your orders', 'Provide customer support', 'Send order updates', 'Improve our website', 'Detect and prevent fraud', 'Comply with legal obligations', 'Send marketing (with consent)'] },
  { heading: 'Information Sharing and Disclosure', body: 'We do not sell your information. We may share with service providers, for legal requirements, or with your consent.', listItems: [] },
  { heading: 'Data Security', body: 'We implement security measures to protect your information. No method of transmission over the Internet is 100% secure.', listItems: [] },
  { heading: 'Your Rights', body: 'You may have rights to access, rectify, delete, object to processing, and withdraw consent.', listItems: [] },
  { heading: 'Cookies and Tracking Technologies', body: 'We use cookies. You can instruct your browser to refuse cookies.', listItems: [] },
  { heading: 'Changes to This Privacy Policy', body: 'We may update this policy. We will post changes and update the Last updated date.', listItems: [] },
  { heading: 'Contact Us', body: 'If you have any questions, please contact us through our Contact Us page.', listItems: [] },
];

export default function PrivacyPolicyPage() {
  const legal = useLegalContent();
  const privacy = legal?.privacy;
  const title = privacy?.title ?? 'Privacy Policy';
  const lastUpdated = privacy?.lastUpdated ?? 'February 13, 2026';
  const sections = privacy?.sections?.length ? privacy.sections : DEFAULT_SECTIONS;

  return (
    <Layout>
      <SEO
        title="Privacy Policy | YoutubeADwords"
        description="Read the YoutubeADwords Privacy Policy to understand how we collect, use, and protect your personal information when you use our services."
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
