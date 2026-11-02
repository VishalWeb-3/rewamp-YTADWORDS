import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { LegalSection } from '../components/LegalSection';
import LegalShell from '../components/site/LegalShell';
import { useLegalContent } from '../contexts/ContentContext';

const DEFAULT_SECTIONS = [
  { heading: 'Overview', body: 'This Refund Policy outlines when refunds may be issued and the process for requesting a refund.', listItems: [], subsections: [] },
  { heading: 'Contact Us', body: 'If you have questions or need to request a refund, please contact us through our Contact Us page.', listItems: [], subsections: [] },
];

export default function RefundPolicyPage() {
  const legal = useLegalContent();
  const refund = legal?.refund;
  const title = refund?.title ?? 'Refund Policy';
  const lastUpdated = refund?.lastUpdated ?? 'February 13, 2026';
  const sections = refund?.sections?.length ? refund.sections : DEFAULT_SECTIONS;

  return (
    <Layout>
      <SEO
        title="Refund Policy | YoutubeADwords"
        description="Learn about the YoutubeADwords Refund Policy. Find out when refunds are issued and how to request one for our social media growth services."
      />
      <LegalShell title={title} lastUpdated={lastUpdated} headings={sections.map((s) => s.heading)}>
            {sections.map((section, i) => (
              <LegalSection key={i} section={section} />
            ))}
      </LegalShell>
    </Layout>
  );
}
