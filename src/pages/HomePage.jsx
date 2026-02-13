import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ServicesSection from '../components/ServicesSection';
import WhyChooseUs from '../components/WhyChooseUs';
import SocialMediaImpact from '../components/SocialMediaImpact';
import PremiumSolutions from '../components/PremiumSolutions';
import ServiceSections from '../components/ServiceSections';
import ComparisonSection from '../components/ComparisonSection';
import WhyChooseYouTubeAdWords from '../components/WhyChooseYouTubeAdWords';
import MeetOurExperts from '../components/MeetOurExperts';
import WhatWeEnsure from '../components/WhatWeEnsure';
import TrustedClients from '../components/TrustedClients';
import FAQ from '../components/FAQ';
import GlobalAudienceCTA from '../components/GlobalAudienceCTA';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <SocialMediaImpact />
      <PremiumSolutions />
      <ServiceSections />
      <ComparisonSection />
      <WhyChooseYouTubeAdWords />
      <MeetOurExperts />
      <WhatWeEnsure />
      <TrustedClients />
      <FAQ />
      <GlobalAudienceCTA />
    </Layout>
  );
}
