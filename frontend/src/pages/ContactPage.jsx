import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    reason: '',
    orderNumber: '',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      setFormData({
        email: '',
        reason: '',
        orderNumber: '',
        message: '',
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Title */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Contact us
            </h1>
            <div className="space-y-3 text-gray-700 text-base lg:text-lg max-w-3xl mx-auto">
              <p>
                If you have anything in mind about our{' '}
                <span className="text-brand-red font-semibold">social media services</span>, and Views4You please send us a message. Our support team will get back to you within{' '}
                <span className="text-brand-red font-semibold">24 hours</span>.
              </p>
              <p>
                If you have any questions about your order, you can easily track its status{' '}
                <a href="#" className="text-brand-red font-semibold hover:underline">here</a>.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 relative overflow-hidden">
            {/* Decorative Red Shapes - Top Right */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
              <div className="absolute top-4 right-4 w-24 h-1 bg-red-200 transform rotate-45 origin-center"></div>
              <div className="absolute top-6 right-6 w-20 h-2 bg-brand-red transform rotate-45 origin-center"></div>
            </div>

            {/* Form Heading */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-8 relative z-10">
              Send us a message
            </h2>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 relative z-10">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Success!</span>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Your Email*"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Reason for Contact Dropdown */}
                  <div className="relative">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for contact
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 appearance-none cursor-pointer pr-10"
                    >
                      <option value="">Reason for contact</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="support">Technical Support</option>
                      <option value="refund">Refund Request</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-4 top-[42px] pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Order Number Field */}
                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="Order Number"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Right Column - Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder="Your message"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 resize-y"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                {/* Cloudflare Footer */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                  <span className="font-semibold">CLOUDFLARE</span>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-700">Privacy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-gray-700">Help</a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
