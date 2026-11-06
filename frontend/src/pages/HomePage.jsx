import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import LandingHero from '../components/landing/LandingHero';
import { Services, HowItWorks, Solutions, Safety, Compare, Voices, Faq, Closer } from '../components/landing/LandingSections';

export default function HomePage() {
  useEffect(() => {
    const root = document.querySelector('.lp');
    if (!root) return undefined;
    root.classList.add('lp-js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    root.querySelectorAll('.lp-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Layout variant="landing">
      <SEO
        title="YoutubeADwords - Buy YouTube Views & Google Ads Campaigns"
        description="Experience rapid growth with YoutubeADwords premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide."
      />
      <main className="lp">
        <LandingHero />
        <Services />
        <HowItWorks />
        <Solutions />
        <Safety />
        <Compare />
        <Voices />
        <Faq />
        <Closer />
      </main>
    </Layout>
  );
}
