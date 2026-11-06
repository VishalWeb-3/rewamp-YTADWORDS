import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContent } from '../contexts/ContentContext';
import { useAuth } from '../contexts/AuthContext';

const SOCIALS = [
  { key: 'youtube', label: 'YouTube', path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z' },
  { key: 'facebook', label: 'Facebook', path: 'M24 12.07C24 5.45 18.63.07 12 .07S0 5.45 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.39H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.23 2.69.23v2.95h-1.52c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.39C19.61 23.02 24 18.06 24 12.07Z' },
  { key: 'twitter', label: 'X', path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z' },
  { key: 'pinterest', label: 'Pinterest', path: 'M12.02 0C5.4 0 .03 5.37.03 11.99c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.2-2.4.04-3.44.22-.94 1.41-5.97 1.41-5.97s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-.99 4-.28 1.19.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.89 2.74.1.12.11.22.08.35l-.33 1.36c-.05.22-.17.27-.4.16-1.5-.7-2.44-2.89-2.44-4.65 0-3.79 2.75-7.26 7.93-7.26 4.16 0 7.4 2.97 7.4 6.93 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.75-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.15 1.12.35 2.32.54 3.55.54 6.61 0 11-5.37 11-11.99C23.97 5.39 18.59.03 11.99.03L12.02 0Z' },
];

function Col({ title, items }) {
  const rows = items.map((it) => (typeof it === 'string' ? { label: it, link: null } : it)).filter((it) => it.link);
  if (!rows.length) return null;
  return (
    <div className="lp-foot-col">
      <h3 className="lp-mono">{title}</h3>
      <ul>
        {rows.map((it) => (
          <li key={it.label}>{it.link === '#' ? <a href="#top">{it.label}</a> : <Link to={it.link}>{it.label}</Link>}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const footer = useGlobalContent()?.footer || {};
  const { isLoggedIn, logout } = useAuth();

  const ourServices = footer.ourServices || [
    { label: 'Buy YouTube Views', link: '/buy-youtube-views' },
    { label: 'Buy YouTube Subscribers', link: '/buy-youtube-subscribers' },
    { label: 'Buy YouTube Likes', link: '/buy-youtube-likes' },
    { label: 'Buy YouTube Watch Hours', link: '/buy-youtube-watch-hours' },
    { label: 'Buy Google Skip Ads Views', link: '/buy-google-skip-ads-views' },
  ];
  const resources = footer.resources || [{ label: 'Blog', link: '/blog' }];
  const company = footer.company || [
    { label: 'About Us', link: '/about-us' },
    { label: 'Tickets / Support', link: '/tickets' },
  ];

  return (
    <footer className="lp-footer">
      <div className="lp-wrap">
        <div className="lp-foot-top">
          <div className="lp-foot-brand">
            <Link to="/" className="lp-logo" aria-label="YoutubeADwords home"><span>Youtube</span><b>AD</b><span>words</span></Link>
            <p>{footer.tagline || 'YoutubeADwords empowers creators and brands to transform raw content into viral success. We make growth easier to achieve, understand, and act on.'}</p>
            <div className="lp-socials">
              {SOCIALS.map((s) => (
                <a key={s.key} href={footer.socials?.[s.key] || '#'} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
          <Col title={footer.ourServicesTitle || 'Our Services'} items={ourServices} />
          <Col title={footer.resourcesTitle || 'Resources'} items={resources} />
          <div className="lp-foot-col">
            <h3 className="lp-mono">{footer.companyTitle || 'Company'}</h3>
            <ul>
              {company.map((it) => (
                <li key={it.label}>{it.link && it.link !== '#' ? <Link to={it.link}>{it.label}</Link> : <a href="#top">{it.label}</a>}</li>
              ))}
              {isLoggedIn && <li><button type="button" onClick={logout}>Logout</button></li>}
            </ul>
          </div>
        </div>

        <p className="lp-foot-legal">
          {footer.legalDisclaimer || "All the materials offered by YoutubeADwords are safeguarded by copyright laws. Unlawful reproduction or distribution of our materials is strictly forbidden. It's important to understand that YoutubeADwords operates independently and is not associated with any social media platforms. This website is not affiliated with or endorsed by YouTube LLC, Google LLC, Facebook, or any other social media platform."}
        </p>

        <div className="lp-foot-bottom">
          <p>{footer.copyright || '© 2026 YoutubeADwords. All rights reserved. | Novence SASU - Cs 48756 Paris'}</p>
          <nav aria-label="Legal">
            <Link to="/privacy-policy">{footer.privacyPolicy || 'Privacy Policy'}</Link>
            <Link to="/terms">{footer.termsOfService || 'Terms of Service'}</Link>
            <Link to="/refund-policy">{footer.refundPolicy || 'Refund Policy'}</Link>
            <Link to="/cookies">{footer.cookiesSettings || 'Cookies Settings'}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
