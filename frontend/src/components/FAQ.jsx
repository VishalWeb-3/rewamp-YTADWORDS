import React, { useState } from 'react';
import { useHomeContent } from '../contexts/ContentContext';

const DEFAULT_FAQS = [
  { question: 'Is using YouTube Ad Words safe for my channel?', answer: 'Yes, absolutely! YouTube Ad Words uses legitimate Google Ads strategies and complies with all platform policies. We deliver real traffic through official ad networks, ensuring your channel remains safe and secure.' },
  { question: "Can your services help me get monetized on YouTube?", answer: "Yes! Our Watch Hours and Subscriber packages are specifically designed to help creators meet YouTube's monetization requirements. We provide authentic engagement that helps you reach the thresholds needed for the YouTube Partner Program." },
  { question: 'Will my subscribers or followers drop over time?', answer: 'No, our services come with a Non-Drop Lifetime Guarantee. We use real traffic and engagement methods, so your subscribers and followers will remain stable. Unlike bot-based services, our authentic approach ensures long-term retention.' },
  { question: 'How long does it take to see results?', answer: 'Results typically start appearing within 24-48 hours of purchase. Delivery speed depends on the package size and service type. Smaller packages may complete faster, while larger campaigns are delivered gradually over days or weeks to ensure natural growth patterns.' },
  { question: 'How is YouTube Ad Words different from other panels?', answer: 'YouTube Ad Words stands out by using legitimate Google Ads strategies instead of bots or proxies. We offer real traffic, 100% policy compliance, non-drop guarantees, and 24/7 expert support. Our White-Hat approach ensures account safety and authentic engagement that lasts.' },
];

export default function FAQ() {
  const home = useHomeContent();
  const section = home?.faq || {};
  const faqs = section.items?.length ? section.items : DEFAULT_FAQS;
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 lg:mb-16">
          {section.heading || 'Frequently Asked'}{' '}
          <span className="text-brand-red relative">
            {section.headingHighlight || 'Questions'}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
          </span>
        </h2>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-2 sm:pr-4 flex-1 min-w-0">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
              </div>
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600 leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
