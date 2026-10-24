import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeContent } from '../../contexts/ContentContext';
import { Arrow, Check, Star, YouTube, TikTok, GoogleG } from './icons';

// Each service is a laminate pass; the pass is also the link to that service's page.
const PASSES = [
  { id: 'ads', to: '/buy-google-skip-ads-views', name: 'Google Ads', serial: 'GA-0004', icon: GoogleG, chip: '#4285F4', strap: '#4285F4', options: ['Skip ads views', 'Display ads views', 'App downloads', 'Website traffic'], r: -21, d: '0.45s' },
  { id: 'tiktok', to: '/buy-tiktok-followers', name: 'TikTok', serial: 'TT-0003', icon: TikTok, chip: '#0b1020', strap: '#0b1020', dark: true, options: ['Followers', 'Likes', 'Views'], r: -8, d: '0.25s' },
  { id: 'youtube', to: '/buy-youtube-views', name: 'YouTube', serial: 'YT-0002', icon: YouTube, chip: '#e53935', strap: '#e53935', options: ['Views', 'Subscribers', 'Likes', 'Watch hours'], r: 19, d: '0.1s' },
  { id: 'reviews', to: '/buy-male-google-reviews', name: 'Google Reviews', serial: 'GR-0001', icon: Star, chip: '#1f9d57', strap: '#1f9d57', options: ['Male', 'Female', 'Local Guide', 'By age group'], r: 5, d: '0s', sample: true },
];

const SAMPLE_TOTAL = 50;

function useDelivery(reduced) {
  const [n, setN] = useState(reduced ? SAMPLE_TOTAL : 0);
  useEffect(() => {
    if (reduced) { setN(SAMPLE_TOTAL); return undefined; }
    let t;
    let cur = 0;
    const tick = () => {
      cur += 1;
      setN(cur);
      t = setTimeout(tick, cur >= SAMPLE_TOTAL ? 2600 : 110);
      if (cur >= SAMPLE_TOTAL) cur = -1;
    };
    t = setTimeout(tick, 1600);
    return () => clearTimeout(t);
  }, [reduced]);
  return n;
}

function Pass({ pass, delivered }) {
  const Icon = pass.icon;
  return (
    <div className="lp-slot" style={{ '--d': pass.d }}>
      <div className="lp-hang" style={{ '--r': `${pass.r}deg`, '--strap': pass.strap }}>
        <span className="lp-strap" aria-hidden="true" />
        <Link to={pass.to} className={`lp-pass${pass.dark ? ' dark' : ''}`} style={{ '--chip': pass.chip }} aria-label={`${pass.name}: view packages`}>
          <span className="lp-pass-slot" aria-hidden="true" />
          <div className="lp-pass-top lp-mono"><span>SERVICE PASS</span><span>{pass.serial}</span></div>
          <span className="lp-pass-ico"><Icon size={22} /></span>
          <h3 className="lp-display">{pass.name}</h3>
          <ul>{pass.options.map((o) => <li key={o}>{o}</li>)}</ul>
          {pass.sample && (
            <div className="lp-order" aria-label="Sample order illustration">
              <span className="tag lp-mono">SAMPLE ORDER</span>
              <b>50 Google Reviews · USA</b>
              <div className="lp-bar"><i style={{ '--p': `${(Math.max(delivered, 0) / SAMPLE_TOTAL) * 100}%` }} /></div>
              <small className="lp-mono">{Math.max(delivered, 0)} / {SAMPLE_TOTAL} delivered</small>
            </div>
          )}
          <div className="lp-holo" aria-hidden="true" />
          <div className="lp-pass-go"><span>View packages</span><Arrow size={18} /></div>
        </Link>
      </div>
    </div>
  );
}

function Headline({ title }) {
  const key = 'Real Social Growth';
  const i = title.indexOf(key);
  const parts = i === -1 ? [[title, false]] : [[title.slice(0, i), false], [key, true], [title.slice(i + key.length), false]];
  let idx = 0;
  return (
    <h1 className="lp-display">
      {parts.map(([text, em], p) => {
        const words = text.split(/(\s+)/).filter((w) => w.trim());
        const spans = words.map((w) => (
          <React.Fragment key={`${p}-${idx}`}>
            <span className="w"><span style={{ '--i': idx++ }}>{w}</span></span>{' '}
          </React.Fragment>
        ));
        return em ? <em key={p}>{spans}</em> : <React.Fragment key={p}>{spans}</React.Fragment>;
      })}
    </h1>
  );
}

export default function LandingHero() {
  const hero = useHomeContent()?.hero || {};
  const stage = useRef(null);
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delivered = useDelivery(reduced);

  useEffect(() => {
    const el = stage.current;
    if (!el || reduced || !window.matchMedia('(hover: hover)').matches) return undefined;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    };
    const leave = () => { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
  }, [reduced]);

  const title = hero.title || 'Build Instant Trust with 5-Star Google Reviews & Real Social Growth';
  const subtitle = hero.subtitle || 'Get verified, organic Google Reviews, YouTube Views, and TikTok Followers.';

  return (
    <section className="lp-hero" id="top">
      <div className="lp-wrap lp-hero-grid">
        <div>
          <Headline title={title} />
          <p className="lp-lede">{subtitle}</p>
          <div className="lp-cta-row">
            <Link to={hero.ctaPrimaryLink || '/buy-male-google-reviews'} className="lp-btn lp-btn-red">{hero.ctaPrimary || 'Get 5-Star Reviews'}<Arrow /></Link>
            <Link to={hero.ctaSecondaryLink || '/contact'} className="lp-btn lp-btn-line">{hero.ctaSecondary || 'Contact Now'}</Link>
          </div>
          <ul className="lp-assure">
            <li><Check size={18} />100% Risk-Free Guarantee</li>
            <li><Check size={18} />We never ask for your password</li>
            <li><Check size={18} />24/7 live support</li>
          </ul>
        </div>

        <div className="lp-stage" ref={stage}>
          <div className="lp-rig">
            <span className="lp-ring" aria-hidden="true" />
            {PASSES.map((p) => <Pass key={p.id} pass={p} delivered={delivered} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
