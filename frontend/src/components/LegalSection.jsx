import React from 'react';
import { Link } from 'react-router-dom';
import { slugify } from './site/LegalShell';

/** Render a legal page section with heading, body, optional list, optional subsections */
export function LegalSection({ section, contactLink = '/contact', contactText = 'Contact Us', privacyLink = '/privacy-policy' }) {
  if (!section) return null;
  const { heading, body, listItems = [], subsections = [] } = section;

  const renderBodyWithLinks = (text) => {
    if (!text || typeof text !== 'string') return text;
    const parts = text.split(/(Contact Us page|Privacy Policy)/gi);
    return parts.map((part, i) => {
      const lower = part.toLowerCase();
      if (lower === 'contact us page') {
        return (
          <Link key={i} to={contactLink} className="text-brand-red font-semibold hover:underline">
            {contactText}
          </Link>
        );
      }
      if (lower === 'privacy policy') {
        return (
          <Link key={i} to={privacyLink} className="text-brand-red font-semibold hover:underline">
            Privacy Policy
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <section id={slugify(heading)} className="pg-legal-sec">
      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{heading}</h2>
      {body && (
        <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-3">
          {renderBodyWithLinks(body)}
        </p>
      )}
      {listItems && listItems.length > 0 && (
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          {listItems.map((item, i) => (
            <li key={i}>{renderBodyWithLinks(item)}</li>
          ))}
        </ul>
      )}
      {subsections && subsections.length > 0 && (
        <div className="space-y-4">
          {subsections.map((sub, i) => (
            <div key={i}>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{sub.subheading}</h3>
              {sub.body && (
                <p className="text-gray-700 text-base leading-relaxed mb-2">
                  {renderBodyWithLinks(sub.body)}
                </p>
              )}
              {sub.listItems && sub.listItems.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {sub.listItems.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
