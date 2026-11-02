import React, { useState } from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { LegalSection } from '../components/LegalSection';
import LegalShell from '../components/site/LegalShell';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_COOKIE_TYPES = [
  { name: 'Essential Cookies', description: 'Required for the website to function. These include security, session management, and load balancing.', alwaysOn: true },
  { name: 'Analytics Cookies', description: 'Help us understand how visitors interact with our website by collecting anonymous information.', alwaysOn: false },
  { name: 'Marketing Cookies', description: 'Used to deliver relevant advertisements and track ad campaign performance.', alwaysOn: false },
];

export default function CookiesSettingsPage() {
  const legal = useLegalContent();
  const cookies = legal?.cookies;
  const title = cookies?.title ?? 'Cookies Settings';
  const lastUpdated = cookies?.lastUpdated ?? 'February 16, 2026';
  const sections = cookies?.sections?.length ? cookies.sections : [];
  const cookieTypes = cookies?.cookieTypes?.length ? cookies.cookieTypes : DEFAULT_COOKIE_TYPES;
  const saveButtonText = cookies?.saveButtonText ?? 'Save Preferences';
  const savedButtonText = cookies?.savedButtonText ?? 'Saved!';

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleableTypes = cookieTypes.filter((c) => !c.alwaysOn);
  const essentialType = cookieTypes.find((c) => c.alwaysOn);

  return (
    <Layout>
      <SEO
        title="Cookies Settings | YoutubeADwords"
        description="Manage your cookie preferences on YoutubeADwords. Learn how we use essential, analytics, and marketing cookies to improve your experience."
      />
      <LegalShell title={title} lastUpdated={lastUpdated} headings={[...sections.map((s) => s.heading).filter((h) => h !== 'Manage Your Preferences'), 'Manage Your Preferences']}>
            {sections
              .filter((s) => s.heading !== 'Manage Your Preferences')
              .map((section, i) => (
                <LegalSection key={i} section={section} />
              ))}

            {/* Manage Your Preferences - special section with toggles */}
            {(sections.some((s) => s.heading === 'Manage Your Preferences') || cookieTypes.length > 0) && (
              <section id="manage-your-preferences" className="pg-legal-sec">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  Manage Your Preferences
                </h2>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                  {sections.find((s) => s.heading === 'Manage Your Preferences')?.body ||
                    'You can customize which cookies we use below. Essential cookies are required for the website to function and cannot be disabled.'}
                </p>
                <div className="space-y-4 border border-gray-200 rounded-xl p-6">
                  {essentialType && (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{essentialType.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{essentialType.description}</p>
                      </div>
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        Always On
                      </span>
                    </div>
                  )}
                  {toggleableTypes.map((ct, idx) => {
                    const isAnalytics = idx === 0;
                    const checked = isAnalytics ? analytics : marketing;
                    const setChecked = isAnalytics ? setAnalytics : setMarketing;
                    return (
                      <div key={idx} className="flex items-start justify-between gap-4 pt-4 border-t border-gray-200">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{ct.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{ct.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                          <span className="ml-3 text-sm text-gray-700">{checked ? 'On' : 'Off'}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleSave}
                  className="mt-6 px-6 py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-[#C62828] transition-colors"
                >
                  {saved ? savedButtonText : saveButtonText}
                </button>
              </section>
            )}
      </LegalShell>
    </Layout>
  );
}
