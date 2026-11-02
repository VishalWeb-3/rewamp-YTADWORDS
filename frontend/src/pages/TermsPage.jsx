import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { LegalSection } from '../components/LegalSection';
import LegalShell from '../components/site/LegalShell';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_SECTIONS = [
  { heading: 'Agreement to Terms', body: 'By accessing and using YoutubeADwords\'s website and services, you accept and agree to be bound by these terms.', listItems: [], subsections: [] },
  { heading: 'Service Description', body: 'YoutubeADwords provides social media growth services. We do not guarantee specific results.', listItems: [], subsections: [] },
  { heading: 'Contact Information', body: 'If you have any questions, please contact us through our Contact Us page.', listItems: [], subsections: [] },
];

export default function TermsPage() {
  const legal = useLegalContent();
  const terms = legal?.terms;
  const title = terms?.title ?? 'Terms of Service';
  const lastUpdated = terms?.lastUpdated ?? 'February 13, 2026';
  const sections = terms?.sections?.length ? terms.sections : DEFAULT_SECTIONS;

  return (
    <Layout>
      <SEO
        title="Terms of Service | YoutubeADwords"
        description="Read the YoutubeADwords Terms of Service. By using our platform, you agree to our terms for YouTube, TikTok, and Google Ads growth services."
      />
      <LegalShell title={title} lastUpdated={lastUpdated} headings={sections.map((s) => s.heading)}>
            {sections.map((section, i) => (
              <LegalSection key={i} section={section} />
            ))}
      </LegalShell>
    </Layout>
  );
}
