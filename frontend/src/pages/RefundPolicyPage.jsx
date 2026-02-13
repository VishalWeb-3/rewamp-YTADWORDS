import React from 'react';
import Layout from '../components/Layout';

export default function RefundPolicyPage() {
  return (
    <Layout>
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Title */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Refund Policy
            </h1>
            <p className="text-gray-600 text-sm">
              Last updated: February 13, 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-6">
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                At Views4You, we strive to provide the best possible service to our customers. This Refund Policy outlines the circumstances under which refunds may be issued and the process for requesting a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Refund Eligibility
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Not Delivered</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    If we fail to deliver the service within the specified delivery timeframe and you have not received any portion of the service, you may be eligible for a full refund.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Service Issues</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    If you experience significant issues with the delivered service (such as drops exceeding our guarantee threshold), we will first attempt to resolve the issue through our refill guarantee. If a refill is not possible or does not resolve the issue, a refund may be considered.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Duplicate Orders</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    If you accidentally place a duplicate order, please contact us within 24 hours of placing the order. We will process a full refund for the duplicate order.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Cancellation Before Delivery</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    If you cancel your order before service delivery has begun, you may be eligible for a refund, subject to a processing fee.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Non-Refundable Situations
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-3">
                Refunds will not be issued in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>If the service has been fully or partially delivered</li>
                <li>If you violate our Terms of Service</li>
                <li>If you provide incorrect information (such as wrong video URL, account username, etc.)</li>
                <li>If you request a refund after the service has been completed successfully</li>
                <li>If the service drops are within normal parameters and covered by our refill guarantee</li>
                <li>If you change your mind after placing an order and the service has started</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Refund Process
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 1: Contact Support</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Submit a refund request through our{' '}
                    <a href="/contact" className="text-brand-red font-semibold hover:underline">Contact Us</a> page or by emailing our support team. Include your order number and a detailed explanation of why you are requesting a refund.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 2: Review</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Our support team will review your request within 24-48 hours. We may request additional information or evidence to process your refund request.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 3: Decision</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    If your refund request is approved, we will process the refund to your original payment method within 5-10 business days.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Refund Methods
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Refunds will be issued to the original payment method used for the purchase. The time it takes for the refund to appear in your account depends on your payment provider and may take up to 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Refill Guarantee vs. Refund
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                For eligible services, we offer a refill guarantee. If you experience drops in engagement, we will first attempt to refill the service at no additional cost. Refunds are only considered if refills are not possible or do not resolve the issue satisfactorily.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Partial Refunds
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                In some cases, we may issue a partial refund if only a portion of the service was delivered or if there were issues with part of the order. The refund amount will be proportional to the undelivered or problematic portion of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Processing Fees
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Some refund requests may be subject to a processing fee, particularly for cancellations made after service delivery has begun. Any applicable fees will be clearly communicated before processing the refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Dispute Resolution
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                If you are not satisfied with our refund decision, please contact us to discuss your concerns. We are committed to finding a fair resolution for all parties involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Changes to Refund Policy
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to this page. Your continued use of our services after changes are posted constitutes your acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                If you have any questions about this Refund Policy or need to request a refund, please contact us through our{' '}
                <a href="/contact" className="text-brand-red font-semibold hover:underline">Contact Us</a> page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
