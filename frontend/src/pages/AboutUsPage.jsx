import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import { Arrow, Check, YouTube, GoogleG } from '../components/landing/icons';

const OFFER = [
  { name: 'YouTube', icon: YouTube, chip: '#e53935', to: '/buy-youtube-views', text: 'Views, subscribers, likes and watch hours, delivered at a pace that looks like normal channel growth.' },
  { name: 'Google Ads', icon: GoogleG, chip: '#4285F4', to: '/buy-google-skip-ads-views', text: 'Skip ads views, display ads views, app downloads and search campaign traffic.' },
];

const WHY = [
  { title: 'Real engagement', text: 'Organic engagement from genuine users, never bot traffic.' },
  { title: 'Safe for your account', text: 'We only ask for a public link. Your passwords stay yours.' },
  { title: 'Support around the clock', text: 'A person answers, whatever your time zone.' },
  { title: 'Refill guarantee', text: 'If numbers drop after delivery, we top them back up.' },
  { title: 'Clear pricing', text: 'The price on the package is the price at checkout.' },
];

export default function AboutUsPage() {
  return (
    <Layout>
      <SEO
        title="About Us | YoutubeADwords"
        description="Learn about YoutubeADwords – a leading provider of YouTube and Google Ads growth services. Authentic engagement, 24/7 support, and best-price guarantee."
      />
      <section className="lp-section" style={{ paddingBottom: 0 }}>
        <div className="lp-wrap lp-split">
          <PageHead
            title="Growth services for creators and local businesses."
            lede="YoutubeADwords helps businesses and content creators grow on YouTube and Google with real, high-quality engagement."
          />
          <div className="lp-prose pg-in" style={{ '--d': '0.7s', paddingTop: '0.75rem' }}>
            <h2 className="lp-display">Our mission</h2>
            <p>Reliable, safe and effective growth that helps our clients reach their marketing goals. We put transparency, quality and customer satisfaction ahead of everything else.</p>
            <Link to="/contact" className="lp-btn lp-btn-line">Talk to the team<Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="lp-section">
        <div className="lp-wrap">
          <div className="lp-head lp-reveal">
            <h2 className="lp-display">What we offer</h2>
            <p>Four service lines, one account and one checkout.</p>
          </div>
          <div className="lp-ledger">
            {OFFER.map(({ name, icon: Icon, chip, to, text }, i) => (
              <div className="lp-row lp-reveal" style={{ '--i': i }} key={name}>
                <div className="lp-row-name">
                  <span className="ico" style={{ '--chip': chip }}><Icon size={26} /></span>
                  <h3 className="lp-display">{name}</h3>
                </div>
                <div className="pg-row-body">
                  <p>{text}</p>
                  <Link to={to}>See {name} packages<Arrow size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section pg-why-sec">
        <div className="lp-wrap">
          <div className="lp-head lp-reveal">
            <h2 className="lp-display">Why customers choose us</h2>
            <p>The promises we hold ourselves to on every order.</p>
          </div>
          <ul className="pg-why">
            {WHY.map((w, i) => (
              <li className="lp-reveal" style={{ '--i': i }} key={w.title}>
                <Check size={22} />
                <div><b>{w.title}</b><p>{w.text}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lp-section lp-final">
        <span className="lp-ring-deco" aria-hidden="true" />
        <div className="lp-wrap">
          <h2 className="lp-display lp-reveal">Questions before you order?</h2>
          <p className="lp-reveal" style={{ '--i': 1 }}>Our support team is here to help, and replies within 24 hours.</p>
          <div className="lp-reveal" style={{ '--i': 2 }}>
            <Link to="/contact" className="lp-btn lp-btn-white">Contact us<Arrow /></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
