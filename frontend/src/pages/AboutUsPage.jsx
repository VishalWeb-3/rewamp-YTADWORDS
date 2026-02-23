import React from 'react';
import Layout from '../components/Layout';

export default function AboutUsPage() {
  return (
    <Layout>
      <div className="bg-white min-h-screen py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Page Title */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About Us
            </h1>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-6">
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Welcome to YoutubeADwords
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                YoutubeADwords is a leading provider of social media growth services, specializing in YouTube, TikTok, and Google Ads services. We are committed to helping businesses and content creators enhance their online presence through authentic, high-quality engagement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Our mission is to provide reliable, safe, and effective social media growth solutions that help our clients achieve their digital marketing goals. We believe in transparency, quality, and customer satisfaction above all else.
              </p>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">YouTube Services</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    We offer comprehensive YouTube growth services including views, subscribers, likes, and watch hours. All our services are designed to help your channel grow organically and safely.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">TikTok Services</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Boost your TikTok presence with our followers, views, engagement, and traffic services. We help creators and businesses reach a wider audience on one of the fastest-growing social media platforms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Google Ads Services</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Enhance your Google Ads campaigns with our skip ads views, display ads views, and search campaign traffic services.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Google Reviews</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Build trust and credibility with authentic Google Reviews from verified reviewers. We offer reviews from different demographics to match your target audience.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Why Choose YoutubeADwords?
              </h2>
              <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Authentic Engagement:</strong> We provide real, organic engagement from genuine users.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Safe & Secure:</strong> All our services comply with platform terms of service.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>24/7 Support:</strong> Our customer support team is available around the clock to assist you.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Refill Guarantee:</strong> We offer refill guarantees on all our packages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Competitive Pricing:</strong> We offer the best prices in the market with transparent pricing.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 text-base lg:text-lg leading-relaxed">
                Have questions or need assistance? Our support team is here to help. Visit our{' '}
                <a href="/contact" className="text-brand-red font-semibold hover:underline">Contact Us</a> page to get in touch.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
