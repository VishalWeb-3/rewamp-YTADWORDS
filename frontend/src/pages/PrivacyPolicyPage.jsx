import React from 'react';
import Layout from '../components/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Title */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm">
              Last updated: February 13, 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-6">
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Introduction
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Views4You ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We may collect personal information that you provide to us, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Account credentials</li>
                    <li>Order history and transaction details</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We automatically collect certain information about your device and how you interact with our website, including:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                    <li>IP address and browser type</li>
                    <li>Pages visited and time spent on pages</li>
                    <li>Referring website addresses</li>
                    <li>Device information</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you updates about your orders and account</li>
                <li>Improve our website and services</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700">
                <li><strong>Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our website and conducting our business.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.</li>
                <li><strong>With Your Consent:</strong> We may share information with your explicit consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Data Security
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-3">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>The right to access your personal information</li>
                <li>The right to rectify inaccurate information</li>
                <li>The right to request deletion of your information</li>
                <li>The right to object to processing of your information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our{' '}
                <a href="/contact" className="text-brand-red font-semibold hover:underline">Contact Us</a> page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
