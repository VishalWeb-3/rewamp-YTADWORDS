import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContent, useHomeContent } from '../../contexts/ContentContext';
import { Arrow, Check, Cross, Star, YouTube, TikTok, GoogleG } from './icons';

const R = ({ children, i = 0, as: Tag = 'div', className = '', ...rest }) => (
  <Tag className={`lp-reveal ${className}`} style={{ '--i': i }} {...rest}>{children}</Tag>
);

const GROUP_STYLE = [
  { icon: GoogleG, chip: '#4285F4' },
  { icon: YouTube, chip: '#e53935' },
  { icon: TikTok, chip: '#0b1020' },
  { icon: Star, chip: '#1f9d57' },
];

export function Services() {
  const groups = useGlobalContent()?.serviceBar?.services || [];
  return (
    <section className="lp-section" id="services">
      <div className="lp-wrap">
        <R className="lp-head">
          <h2 className="lp-display">Pick what you are growing.</h2>
          <p>Four service lines, one checkout. Choose a page, set the package, and track the order from your account.</p>
        </R>
        <div className="lp-ledger">
          {groups.map((g, gi) => {
            const { icon: Icon, chip } = GROUP_STYLE[gi] || GROUP_STYLE[0];
            return (
              <R className="lp-row" i={gi} key={g.label}>
                <div className="lp-row-name">
                  <span className="ico" style={{ '--chip': chip }}><Icon size={26} /></span>
                  <h3 className="lp-display">{g.label}</h3>
                </div>
                <div className="lp-links">
                  {(g.items || []).map((it) => (
                    <Link key={it.link} to={it.link}>{it.label}<Arrow size={16} /></Link>
                  ))}
                </div>
              </R>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { title: 'Choose a service', text: 'Open the YouTube, TikTok, Google Ads or Google Reviews page and pick a package.' },
  { title: 'Share a link, never a password', text: 'We need your video, profile or business link. Nothing that lets us log in to your account.' },
  { title: 'Follow it in My Orders', text: 'Check delivery from your account. If something looks wrong, support is one message away.' },
];

export function HowItWorks() {
  return (
    <section className="lp-section lp-how" id="how" style={{ paddingTop: 0 }}>
      <div className="lp-wrap">
        <R className="lp-head">
          <h2 className="lp-display">Three steps, no login handed over.</h2>
        </R>
        <ol className="lp-steps">
          {STEPS.map((s, i) => (
            <R as="li" i={i} key={s.title}>
              <span className="num lp-mono" aria-hidden="true">0{i + 1}</span>
              <h3 className="lp-display">{s.title}</h3>
              <p>{s.text}</p>
            </R>
          ))}
        </ol>
        <R i={3} className="lp-how-note">
          Before you buy: <Link to="/refund-policy">read the refund policy</Link> or <Link to="/contact">ask us a question</Link>.
        </R>
      </div>
    </section>
  );
}

export function Solutions() {
  const s = useHomeContent()?.premiumSolutions || {};
  const benefits = s.benefits || [];
  return (
    <section className="lp-section" style={{ paddingTop: 0 }}>
      <div className="lp-wrap lp-split">
        <R>
          <h2 className="lp-display" style={{ fontSize: 'clamp(2.2rem,4.6vw,3.8rem)', margin: '0 0 1.25rem' }}>{s.subtitle || 'Buy Google Ads Services'}</h2>
          <p style={{ color: 'var(--ink-2)', fontSize: '1.1rem', margin: '0 0 2rem', maxWidth: '32rem' }}>{s.title}</p>
          <ul className="lp-checks">
            {benefits.map((b) => <li key={b}><Check />{b}</li>)}
          </ul>
          <Link to="/buy-google-skip-ads-views" className="lp-btn lp-btn-red">{s.ctaButton || 'Start Google Ads Campaign'}<Arrow /></Link>
        </R>
        <R i={2} className="lp-prose" style={{ paddingTop: '0.5rem' }}>
          <h3 className="lp-display">{s.block1Title}</h3>
          <p>{s.block1Text}</p>
          <h3 className="lp-display">{s.block2Title}</h3>
          <p style={{ marginBottom: 0 }}>{s.block2Text}</p>
        </R>
      </div>
    </section>
  );
}

export function Safety() {
  const home = useHomeContent();
  const ensure = home?.whatWeEnsure || {};
  const why = home?.whyChooseUs || {};
  return (
    <section className="lp-section lp-ink" id="why">
      <div className="lp-wrap">
        <R className="lp-head">
          <h2 className="lp-display">{ensure.title || 'What We'} {ensure.titleHighlight || 'Ensure'}</h2>
          <p>Safe, real-person engagement is the whole point. Here is what we hold ourselves to.</p>
        </R>
        <div className="lp-pillars">
          {(ensure.cards || []).map((c, i) => (
            <R className="lp-pillar" i={i} key={c.title}>
              <div className="lp-holo" aria-hidden="true" />
              <h3 className="lp-display">{c.title}</h3>
              <p>{c.description}</p>
            </R>
          ))}
        </div>
        <R className="lp-head" style={{ marginBottom: '1.5rem' }}>
          <h3 className="lp-display" style={{ fontSize: '1.9rem', margin: 0 }}>{why.title || 'Why Choose Us?'}</h3>
        </R>
        <ul className="lp-feat">
          {(why.features || []).map((f, i) => (
            <R as="li" i={i % 4} key={f.title}><Check size={20} />{f.title}</R>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Compare() {
  const c = useHomeContent()?.comparison || {};
  return (
    <section className="lp-section" id="compare">
      <div className="lp-wrap">
        <R className="lp-head">
          <h2 className="lp-display">{c.heading || 'Why We Are'} {c.better || 'Better?'}</h2>
        </R>
        <R className="lp-compare">
          <div className="lp-col other">
            <h3 className="lp-display">{c.otherTitle || 'Other Providers'}</h3>
            <ul>
              {(c.otherPoints || []).map((p, i) => <li key={p} style={{ '--i': i }}><Cross size={18} /><span>{p}</span></li>)}
            </ul>
          </div>
          <div className="lp-col us">
            <div className="lp-holo" aria-hidden="true" />
            <h3 className="lp-display">{c.ourTitle || 'YoutubeADwords'}<span className="lp-best">{c.bestChoice || 'BEST CHOICE'}</span></h3>
            <ul>
              {(c.ourPoints || []).map((p) => <li key={p}><Check size={20} />{p}</li>)}
            </ul>
          </div>
        </R>
      </div>
    </section>
  );
}

export function Voices() {
  const t = useHomeContent()?.trustedClients || {};
  const items = t.testimonials || [];
  return (
    <section className="lp-section" style={{ paddingBottom: 0 }} id="voices">
      <div className="lp-wrap">
        <R className="lp-head" style={{ marginBottom: 0 }}>
          <h2 className="lp-display">{t.title || 'Our Trusted'} {t.titleHighlight || 'Clients'}</h2>
          <p>{t.subtitle}</p>
        </R>
      </div>
      <div className="lp-voices scroll-thin" tabIndex={0} aria-label="Customer quotes, scroll sideways">
        {items.map((v, i) => (
          <figure className="lp-voice" key={v.handle} style={{ margin: 0 }}>
            <span className="lp-pass-slot" aria-hidden="true" />
            <span className="tag lp-mono">{v.category.toUpperCase()}</span>
            <blockquote>&ldquo;{v.quote}&rdquo;</blockquote>
            <figcaption className="who"><b>{v.name}</b><span>{v.handle}</span></figcaption>
            <div className="lp-holo" aria-hidden="true" />
          </figure>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  const f = useHomeContent()?.faq || {};
  const [open, setOpen] = useState(0);
  return (
    <section className="lp-section" id="faq">
      <div className="lp-wrap lp-faq">
        <R className="lp-head">
          <h2 className="lp-display">{f.heading || 'Frequently Asked'} {f.headingHighlight || 'Questions'}</h2>
          <p>Straight answers before you spend anything.</p>
        </R>
        <R i={1}>
          {(f.items || []).map((q, i) => (
            <div className={`lp-q${open === i ? ' open' : ''}`} key={q.question}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q.question}</span><span className="pm" aria-hidden="true" />
              </button>
              <div className="lp-a"><div><p>{q.answer}</p></div></div>
            </div>
          ))}
        </R>
      </div>
    </section>
  );
}

export function Closer() {
  const g = useHomeContent()?.globalAudienceCta || {};
  return (
    <section className="lp-section lp-final">
      <span className="lp-ring-deco" aria-hidden="true" />
      <div className="lp-wrap">
        <R><h2 className="lp-display">{g.title || 'Expanding your reach'} {g.titleHighlight || 'to a Global Audience'}</h2></R>
        <R i={1}><p>{g.paragraph1}</p><p>{g.paragraph2}</p></R>
        <R i={2}><a href="#top" className="lp-btn lp-btn-white">Choose your pass<Arrow /></a></R>
        <R i={3} className="lp-final-links">
          <Link to="/buy-youtube-views">Buy YouTube views</Link>
          <Link to="/buy-tiktok-followers">Buy TikTok followers</Link>
          <Link to="/buy-male-google-reviews">Buy Google reviews</Link>
          <Link to="/buy-google-skip-ads-views">Google Ads views</Link>
        </R>
      </div>
    </section>
  );
}
