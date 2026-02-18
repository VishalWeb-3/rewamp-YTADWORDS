import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useContactContent } from '../contexts/ContentContext';

export default function ContactPage() {
  const c = useContactContent();
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
      <div className="bg-white min-h-screen py-8 sm:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {c?.title ?? 'Contact us'}
            </h1>
            <div className="space-y-3 text-gray-700 text-base lg:text-lg max-w-3xl mx-auto">
              <p>{c?.introParagraph1 ?? 'If you have anything in mind about our social media services, and YoutubeAdWords please send us a message. Our support team will get back to you within 24 hours.'}</p>
              <p>
                {c?.introParagraph2 ?? 'If you have any questions about your order, you can easily track its status '}
                <a href={c?.trackOrderLinkHref ?? '#'} className="text-brand-red font-semibold hover:underline">{c?.trackOrderLinkText ?? 'here'}</a>.
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
              {c?.formHeading ?? 'Send us a message'}
            </h2>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 bg-gray-900 text-white px-4 py-3 rounded-full flex items-center gap-2 relative z-10">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{c?.successMessage ?? 'Success!'}</span>
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
                      {c?.labelEmail ?? 'Your Email'} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder={c?.placeholderEmail ?? 'Your Email*'}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Reason for Contact Dropdown */}
                  <div className="relative">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      {c?.labelReason ?? 'Reason for contact'}
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 appearance-none cursor-pointer pr-10"
                    >
                      <option value="">{c?.placeholderReason ?? 'Reason for contact'}</option>
                      {(c?.reasonOptions ?? [
                        { value: 'general', label: 'General Inquiry' },
                        { value: 'order', label: 'Order Question' },
                        { value: 'support', label: 'Technical Support' },
                        { value: 'refund', label: 'Refund Request' },
                        { value: 'other', label: 'Other' },
                      ]).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
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
                      {c?.labelOrderNumber ?? 'Order Number'}
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder={c?.placeholderOrderNumber ?? 'Order Number'}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Right Column - Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {c?.labelMessage ?? 'Your message'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="8"
                    placeholder={c?.placeholderMessage ?? 'Your message'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-gray-900 resize-y"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
                

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {isSubmitting ? (c?.submittingButton ?? 'Submitting...') : (c?.submitButton ?? 'Submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
