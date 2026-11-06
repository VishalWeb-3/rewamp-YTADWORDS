import React, { useEffect, useRef, useState } from 'react';
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
        {/* the two explainers fold away; the first starts open so the column isn't empty */}
        <R i={2} className="lp-folds">
          {[[s.block1Title, s.block1Text], [s.block2Title, s.block2Text]].filter(([t]) => t).map(([t, body], i) => (
            <details key={t} open={i === 0}>
              <summary><span className="lp-display">{t}</span><span className="pm" aria-hidden="true" /></summary>
              <p>{body}</p>
            </details>
          ))}
        </R>
      </div>
    </section>
  );
}

// Barcode bars for the stub, derived from the feature titles so it stays the same between renders.
const barsFrom = (text) => {
  const out = [];
  let x = 0;
  for (let i = 0; i < text.length && x < 220; i += 1) {
    const c = text.charCodeAt(i);
    const w = 1 + (c % 3);
    out.push({ x, w });
    x += w + 1 + ((c >> 2) % 3);
  }
  return out;
};

const MICRO = 'REAL PEOPLE · SAFE DELIVERY · NO PASSWORDS · '.repeat(160);

const Seal = () => (
  <div className="lp-seal" aria-hidden="true">
    <svg viewBox="0 0 120 120">
      <defs><path id="lp-seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
      <text><textPath href="#lp-seal-ring" textLength="272" lengthAdjust="spacing">REAL PEOPLE · SAFE DELIVERY · NO PASSWORDS ·</textPath></text>
      <path className="tick" d="M44 61 l11 11 22 -24" />
    </svg>
  </div>
);

// the loupe follows the mouse over the pass (touch would leave it stuck on screen); the seal's foil turns with it
const inspect = (e) => {
  if (e.pointerType !== 'mouse') return;
  const pass = e.currentTarget;
  const r = pass.getBoundingClientRect();
  pass.style.setProperty('--lx', `${e.clientX - r.left}px`);
  pass.style.setProperty('--ly', `${e.clientY - r.top}px`);
  pass.classList.add('is-looking');
  const seal = pass.closest('.lp-check')?.querySelector('.lp-seal');
  if (seal) {
    seal.style.setProperty('--sx', ((e.clientX - r.left) / r.width).toFixed(3));
    seal.style.setProperty('--sy', ((e.clientY - r.top) / r.height).toFixed(3));
  }
};
const stopInspect = (e) => e.currentTarget.classList.remove('is-looking');

// What we ensure, as the door check: the promises are the conditions printed on the back of the pass,
// and the reasons to choose us are punched into its tear-off stub.
export function Safety() {
  const home = useHomeContent();
  const ensure = home?.whatWeEnsure || {};
  const why = home?.whyChooseUs || {};
  const features = why.features || [];
  const bars = barsFrom(features.map((f) => f.title).join(''));
  return (
    <section className="lp-section lp-check" id="why">
      <div className="lp-wrap lp-check-grid">
        <R className="lp-check-intro">
          <h2 className="lp-display">{ensure.title || 'What We'} {ensure.titleHighlight || 'Ensure'}</h2>
          <p>Safe, real-person engagement is the whole point. Here is what we hold ourselves to.</p>
          <ol className="lp-terms">
            {(ensure.cards || []).map((c) => (
              <li key={c.title}>
                <h3 className="lp-display">{c.title}</h3>
                <p>{c.description}</p>
              </li>
            ))}
          </ol>
        </R>

        <R className="lp-check-hang" i={1}>
          <article className="lp-back" onPointerMove={inspect} onPointerLeave={stopInspect}>
            <span className="lp-back-slot" aria-hidden="true" />
            <div className="lp-micro" aria-hidden="true">{MICRO}</div>
            <span className="lp-loupe" aria-hidden="true" />

            <div className="lp-pass-head">
              <Seal />
              <div>
                <h3 className="lp-display">{why.title || 'Why Choose Us?'}</h3>
                <p className="lp-check-hint" aria-hidden="true">Move over the pass to check its print.</p>
              </div>
            </div>

            {features.length > 0 && (
              <div className="lp-stub">
                <ul className="lp-punch">
                  {features.map((f, i) => (
                    <li key={f.title} style={{ '--i': i }}><span className="hole" aria-hidden="true" />{f.title}</li>
                  ))}
                </ul>
                <svg className="lp-barcode" viewBox="0 0 220 40" preserveAspectRatio="none" aria-hidden="true">
                  {bars.map((b) => <rect key={b.x} x={b.x} width={b.w} height="40" />)}
                </svg>
              </div>
            )}
          </article>
        </R>
      </div>
    </section>
  );
}

// Why we are better, as a split-flap board: each slat shows what other providers do, then flips to
// what we do instead. It flips by itself the first time it scrolls into view; the switch flips it back.
export function Compare() {
  const c = useHomeContent()?.comparison || {};
  const theirs = c.otherPoints || [];
  const ours = c.ourPoints || [];
  const rows = Array.from({ length: Math.max(theirs.length, ours.length) }, (_, i) => [theirs[i], ours[i]]);
  const [side, setSide] = useState('them');
  const [flipped, setFlipped] = useState(false); // once it has shown ours, flipping back animates too
  const show = (s) => { setSide(s); if (s === 'us') setFlipped(true); };
  const board = useRef(null);

  useEffect(() => {
    const el = board.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { show('us'); return undefined; }
    let t;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      t = setTimeout(() => show('us'), 700);
      io.disconnect();
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  const us = side === 'us';
  return (
    <section className="lp-section" id="compare">
      <div className="lp-wrap">
        <R className="lp-flip-head">
          <h2 className="lp-display">{c.heading || 'Why We Are'} {c.better || 'Better?'}</h2>
          <div className="lp-flip-switch" role="group" aria-label="Show the comparison for">
            <button type="button" aria-pressed={!us} onClick={() => show('them')}>{c.otherTitle || 'Other Providers'}</button>
            <button type="button" aria-pressed={us} onClick={() => show('us')}>
              {c.ourTitle || 'YoutubeADwords'}<span className="lp-best">{c.bestChoice || 'BEST CHOICE'}</span>
            </button>
          </div>
        </R>
        <ul ref={board} className={`lp-board${us ? ' is-us' : flipped ? ' is-back' : ''}`} aria-live="polite">
          {rows.map(([them, mine], i) => (
            <li key={mine || them} className="lp-slat" style={{ '--i': i }}>
              <div className="lp-flap">
                <div className="lp-face them" aria-hidden={us}><Cross size={20} /><span>{them}</span></div>
                <div className="lp-face us" aria-hidden={!us}>
                  <Check size={20} />
                  <span>{them && <small><s>{them}</s></small>}{mine}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
        {items.map((v) => (
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
        <R i={1}><p>{g.paragraph2 || g.paragraph1}</p></R>
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
