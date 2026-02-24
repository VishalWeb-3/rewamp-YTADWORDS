import React from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import SocialMediaImpact from '../components/SocialMediaImpact';
import PremiumSolutions from '../components/PremiumSolutions';
import ServiceSections from '../components/ServiceSections';
import ComparisonSection from '../components/ComparisonSection';
import WhyChooseYoutubeADwords from '../components/WhyChooseYoutubeADwords';
import MeetOurExperts from '../components/MeetOurExperts';
import WhatWeEnsure from '../components/WhatWeEnsure';
import TrustedClients from '../components/TrustedClients';
import FAQ from '../components/FAQ';
import GlobalAudienceCTA from '../components/GlobalAudienceCTA';

export default function HomePage() {
  return (
    <Layout>
      <SEO
        title="YoutubeADwords - Buy YouTube Views, Google Ads & TikTok Campaigns"
        description="Experience rapid growth with YoutubeADwords premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide."
      />
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <SocialMediaImpact />
      <PremiumSolutions />
      <ServiceSections />
      <ComparisonSection />
      <WhyChooseYoutubeADwords />
      <MeetOurExperts />
      <WhatWeEnsure />
      <TrustedClients />
      <FAQ />
      <GlobalAudienceCTA />
    </Layout>
  );
}
