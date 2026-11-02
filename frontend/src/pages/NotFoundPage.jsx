import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PageHead from '../components/site/PageHead';
import Pass from '../components/site/Pass';
import { Arrow } from '../components/landing/icons';

const POPULAR = [
  { to: '/buy-youtube-views', label: 'Buy YouTube views' },
  { to: '/buy-tiktok-followers', label: 'Buy TikTok followers' },
  { to: '/buy-male-google-reviews', label: 'Buy Google reviews' },
  { to: '/buy-google-skip-ads-views', label: 'Google Ads views' },
];

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO title="Page Not Found | YoutubeADwords" description="The page you are looking for does not exist." />
      <div className="pg-status pg-wrap">
        <div>
          <PageHead
            title="This page isn't on the list."
            lede="The link may be old or mistyped. Every service is still one click from the home page."
          >
            <div className="pg-actions">
              <Link to="/" className="lp-btn lp-btn-red">Browse services<Arrow /></Link>
              <Link to="/contact" className="lp-btn lp-btn-line">Contact support</Link>
            </div>
          </PageHead>
          <ul className="pg-links pg-in" style={{ '--d': '0.8s' }}>
            {POPULAR.map((l) => (
              <li key={l.to}><Link to={l.to}>{l.label}<Arrow size={16} /></Link></li>
            ))}
          </ul>
        </div>
        <div className="pg-status-pass" aria-hidden="true">
          <Pass
            kind="Gate"
            serial="ERR-404"
            tone="void"
            swing
            title="No entry"
            rows={[{ label: 'Requested page', value: 'Not found', mono: true }]}
            stamp="404"
          />
        </div>
      </div>
    </Layout>
  );
}
