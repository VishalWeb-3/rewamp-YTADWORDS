import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHomeContent } from '../../contexts/ContentContext';
import { Arrow, Check, Star, YouTube, TikTok, GoogleG, Hand, Volume, Mute } from './icons';

// Each service is a laminate pass; the pass is also the link to that service's page.
// `flip` mirrors a pass's content to its right edge: those two fan out to the right and the front
// pass covers their left half, which would hide the name.
const PASSES = [
  { id: 'ads', to: '/buy-google-skip-ads-views', name: 'Google Ads', serial: 'GA-0004', icon: GoogleG, chip: '#4285F4', strap: '#4285F4', options: ['Skip ads views', 'Display ads views', 'App downloads', 'Website traffic'], flip: true, r: -21, d: '0.45s' },
  { id: 'tiktok', to: '/buy-tiktok-followers', name: 'TikTok', serial: 'TT-0003', icon: TikTok, chip: '#0b1020', strap: '#0b1020', dark: true, options: ['Followers', 'Likes', 'Views'], flip: true, r: -8, d: '0.25s' },
  { id: 'youtube', to: '/buy-youtube-views', name: 'YouTube', serial: 'YT-0002', icon: YouTube, chip: '#e53935', strap: '#e53935', options: ['Views', 'Subscribers', 'Likes', 'Watch hours'], r: 19, d: '0.1s' },
  { id: 'reviews', to: '/buy-male-google-reviews', name: 'Google Reviews', serial: 'GR-0001', icon: Star, chip: '#1f9d57', strap: '#1f9d57', options: ['Male', 'Female', 'Local Guide', 'By age group'], r: 5, d: '0s', sample: true },
];

const SAMPLE_TOTAL = 50;
const SOUND_KEY = 'lp-pass-sound';
// card sounds are opt-in: off unless the visitor switched them on before
const readSound = () => {
  try { return localStorage.getItem(SOUND_KEY) === '1'; } catch { return false; }
};

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

// Pendulum toy: grab a pass and swing it from its notch. Passes are rods hanging from one pivot, so each
// one is an angle plus a pull (how far its strap is stretched); neighbours collide when they get closer
// than GAP degrees.
const PIVOT_UP = 260;   // pivot sits this many px above a pass (matches .lp-hang transform-origin)
// Real pendulum: theta'' = -(g/L) sin(theta) - 2 (L'/L) theta' - damping * theta'. The fan angle is each pass's
// equilibrium, so theta is measured from rest. L is the rod length to the pass's centre of mass and grows as
// the strap is pulled, so a stretched pass swings slower and speeds up as its strap shortens.
const PEND_LEN = 430;                 // px from the pivot to a pass's centre
const GRAVITY = 85 * PEND_LEN;        // px/s^2, tuned so a small swing takes ~0.7s
const DAMPING = 3.2;    // base damping, ramped up after SETTLE_FROM so everything is home ~1s after release
const PULL_SPRING = 160;
const PULL_DAMPING = 6;
const PULL_MIN = -15;
const PULL_MAX = 90;    // px a strap may stretch
const SETTLE_FROM = 0.55;
const SETTLE_DONE = 1.25;
const FADE_FROM = 0.8;  // from here to SETTLE_DONE any offset still left is bled away, so the final snap is invisible
const FADE_RATE = 20;
const GAP = 11;         // closest two neighbouring passes may get, in degrees
const BOUNCE = 0.72;
const MAX_ANGLE = 80;
const MAX_SPEED = 900;  // deg/s
const HIT_MIN = 45;     // relative deg/s that counts as a knock worth flashing
const BRUSH_GAIN = 10;  // deg/s of push per degree the cursor sweeps across a pass
const BRUSH_MAX = 70;
const BRUSH_CAP = 150;  // brushing never pushes a pass faster than this

// A soft wooden tick, synthesised so there is no asset to load. Only ever started from a drag.
function makeTicker() {
  let ctx = null;
  let lastTick = 0;
  return {
    unlock() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!ctx && AC) ctx = new AC();
        if (ctx && ctx.state === 'suspended') ctx.resume();
      } catch { /* audio is optional */ }
    },
    tick(strength) {
      if (!ctx || ctx.state !== 'running' || ctx.currentTime - lastTick < 0.05) return;
      lastTick = ctx.currentTime;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520 + strength * 260, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.07);
      gain.gain.setValueAtTime(0.025 + strength * 0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    },
  };
}

function usePassPhysics(stageRef, reduced, soundRef) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return undefined;
    const hangs = [...stage.querySelectorAll('.lp-hang')];
    const slots = [...stage.querySelectorAll('.lp-slot')];
    const cards = [...stage.querySelectorAll('.lp-pass')];
    const rest = PASSES.map((p) => p.r);
    const order = rest.map((_, i) => i).sort((x, y) => rest[x] - rest[y]);
    const a = rest.slice();
    const v = rest.map(() => 0);
    const d = rest.map(() => 0);   // strap stretch in px
    const vd = rest.map(() => 0);
    const ticker = makeTicker();
    const lastHit = rest.map(() => 0);
    let live = false;
    let raf = 0;
    let last = 0;
    let press = null;
    let brush = null;
    let grabbed = -1;
    let dragTo = 0;
    let dragPull = 0;
    let releasedAt = 0;
    let swallowClick = false;

    const clamp = (n, lim) => Math.max(-lim, Math.min(lim, n));
    const angleOf = (el) => {
      const m = getComputedStyle(el).transform;
      if (!m || m === 'none') return 0;
      const [ma, mb] = m.slice(m.indexOf('(') + 1, -1).split(',').map(Number);
      return (Math.atan2(mb, ma) * 180) / Math.PI;
    };
    // where the pivot is on screen, and how big one layout px is
    const frameOf = (i) => {
      const r = slots[i].getBoundingClientRect();
      const s = r.width / 230;
      return { px: r.left + r.width / 2, py: r.top - PIVOT_UP * s, s };
    };
    // CSS rotate() is clockwise, so a pointer to the right of the pivot is a negative angle
    const pointerAngle = (i, x, y) => {
      const { px, py } = frameOf(i);
      return (-Math.atan2(x - px, y - py) * 180) / Math.PI;
    };
    const pointerRadius = (i, x, y) => {
      const { px, py, s } = frameOf(i);
      return Math.hypot(x - px, y - py) / s;
    };

    // a knock: brief flash and bump on the pass, and a tick if sound is on
    const hit = (i, strength) => {
      const now = performance.now();
      if (now - lastHit[i] < 120) return;
      lastHit[i] = now;
      cards[i].animate(
        [{ filter: `brightness(${1 + 0.16 * strength})`, scale: 1 + 0.035 * strength }, { filter: 'brightness(1)', scale: 1 }],
        { duration: 260, easing: 'ease-out' },
      );
      if (soundRef.current) ticker.tick(strength);
    };

    const collide = () => {
      for (let pass = 0; pass < 2; pass += 1) {
        for (let k = 0; k < order.length - 1; k += 1) {
          const L = order[k];
          const R = order[k + 1];
          const over = GAP - (a[R] - a[L]);
          if (over <= 0) continue;
          const wL = L === grabbed ? 0 : 1;
          const wR = R === grabbed ? 0 : 1;
          if (wL + wR === 0) continue;
          a[L] -= (over * wL) / (wL + wR);
          a[R] += (over * wR) / (wL + wR);
          const rel = v[R] - v[L];
          if (rel < 0) {
            const j = (-(1 + BOUNCE) * rel) / (wL + wR);
            v[L] -= j * wL;
            v[R] += j * wR;
            if (-rel > HIT_MIN) {
              const strength = Math.min(1, -rel / 400);
              hit(L, strength);
              hit(R, strength);
            }
          }
        }
      }
    };

    const finish = () => {
      live = false;
      cancelAnimationFrame(raf);
      stage.classList.remove('lp-live', 'lp-dragging');
      hangs.forEach((h) => {
        h.style.transform = '';
        h.style.removeProperty('--pull');
        h.style.removeProperty('--a');
      });
      slots.forEach((sl) => { sl.style.zIndex = ''; });
    };

    const frame = (now) => {
      // rAF timestamps can match or trail performance.now(); a zero step would divide by zero below
      const dt = Math.min(Math.max((now - last) / 1000, 1 / 240), 1 / 30);
      last = now;
      const since = grabbed === -1 ? (now - releasedAt) / 1000 : 0;
      const extra = Math.max(0, since - SETTLE_FROM) * 50;
      for (let step = 0; step < 2; step += 1) {
        const h = dt / 2;
        for (let i = 0; i < a.length; i += 1) {
          if (i === grabbed) {
            const prev = a[i];
            const prevD = d[i];
            a[i] += (dragTo - a[i]) * Math.min(1, h * 30);
            d[i] += (dragPull - d[i]) * Math.min(1, h * 30);
            v[i] = clamp(v[i] * 0.5 + ((a[i] - prev) / h) * 0.5, MAX_SPEED);
            vd[i] = clamp(vd[i] * 0.5 + ((d[i] - prevD) / h) * 0.5, 1500);
          } else {
            const len = PEND_LEN + d[i];
            const theta = ((a[i] - rest[i]) * Math.PI) / 180;
            const swing = -(GRAVITY / len) * Math.sin(theta) * (180 / Math.PI) - 2 * (vd[i] / len) * v[i];
            v[i] = clamp(v[i] + (swing - (DAMPING + extra) * v[i]) * h, MAX_SPEED);
            a[i] += v[i] * h;
            vd[i] = clamp(vd[i] + (-PULL_SPRING * d[i] - (PULL_DAMPING + extra) * vd[i]) * h, 1500);
            d[i] += vd[i] * h;
          }
        }
        collide();
      }
      if (since > FADE_FROM) {
        const fade = Math.min(1, (since - FADE_FROM) / (SETTLE_DONE - FADE_FROM));
        const k = Math.exp(-fade * FADE_RATE * dt);
        for (let i = 0; i < a.length; i += 1) {
          a[i] = rest[i] + (a[i] - rest[i]) * k;
          v[i] *= k;
          d[i] *= k;
          vd[i] *= k;
        }
      }
      if (![...a, ...v, ...d, ...vd].every(Number.isFinite)) { finish(); return; }
      hangs.forEach((el, i) => {
        el.style.transform = `rotate(${a[i].toFixed(3)}deg)`;
        el.style.setProperty('--pull', `${d[i].toFixed(2)}px`);
        el.style.setProperty('--a', (a[i] - rest[i]).toFixed(2));
      });
      if (grabbed === -1) {
        const home = a.every((x, i) => Math.abs(x - rest[i]) < 0.3 && Math.abs(v[i]) < 8 && Math.abs(d[i]) < 0.6 && Math.abs(vd[i]) < 12);
        if ((since >= 1 && home) || since >= SETTLE_DONE) { finish(); return; }
      }
      raf = requestAnimationFrame(frame);
    };

    // take over from the CSS sway, starting exactly where it left each pass so nothing jumps
    const engage = () => {
      if (live) return;
      hangs.forEach((el, i) => { a[i] = angleOf(el); v[i] = 0; d[i] = 0; vd[i] = 0; });
      stage.classList.add('lp-live');
      hangs.forEach((el, i) => { el.style.transform = `rotate(${a[i]}deg)`; });
      live = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const startDrag = (e) => {
      engage();
      ticker.unlock();
      grabbed = press.i;
      press.base = a[grabbed];
      dragTo = a[grabbed];
      dragPull = d[grabbed];
      slots[grabbed].style.zIndex = 30;
      stage.classList.add('lp-dragging', 'lp-touched');
      swallowClick = true;
      press.moved = true;
      try { stage.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    };

    const onMove = (e) => {
      if (!press || e.pointerId !== press.id) return;
      if (!press.moved) {
        if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6) return;
        startDrag(e);
      }
      dragTo = clamp(press.base + (pointerAngle(press.i, e.clientX, e.clientY) - press.ang0), MAX_ANGLE);
      dragPull = Math.max(PULL_MIN, Math.min(PULL_MAX, pointerRadius(press.i, e.clientX, e.clientY) - press.rad0));
    };

    const onUp = (e) => {
      if (!press || (e && e.pointerId !== press.id)) return;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (press.moved) {
        try { stage.releasePointerCapture(press.id); } catch { /* not captured */ }
        grabbed = -1;
        releasedAt = performance.now();
        stage.classList.remove('lp-dragging');
        setTimeout(() => { swallowClick = false; }, 80);
      }
      press = null;
    };

    const onDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      // a release that never reached us (e.g. mouse let go outside the window) must not lock the toy
      if (press) onUp();
      const hang = e.target.closest?.('.lp-pass')?.closest('.lp-hang');
      const i = hang ? hangs.indexOf(hang) : -1;
      if (i < 0) return;
      press = {
        i,
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        ang0: pointerAngle(i, e.clientX, e.clientY),
        rad0: pointerRadius(i, e.clientX, e.clientY),
        moved: false,
      };
      brush = null;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    // brushing the cursor across a hanging pass nudges it, no click needed
    const onBrush = (e) => {
      if (press || grabbed !== -1 || e.pointerType !== 'mouse' || e.buttons) return;
      const hang = e.target.closest?.('.lp-pass')?.closest('.lp-hang');
      const i = hang ? hangs.indexOf(hang) : -1;
      if (i < 0) { brush = null; return; }
      const phi = pointerAngle(i, e.clientX, e.clientY);
      if (brush && brush.i === i) {
        const sweep = phi - brush.phi;
        if (Math.abs(sweep) > 0.15) {
          engage();
          if (Math.abs(v[i]) < BRUSH_CAP) v[i] = clamp(v[i] + clamp(sweep * BRUSH_GAIN, BRUSH_MAX), MAX_SPEED);
          releasedAt = performance.now();
        }
      }
      brush = { i, phi };
    };
    const onLeave = () => { brush = null; };

    // a drag must not follow the pass's link, and the browser must not start a native link drag
    const onClick = (e) => { if (swallowClick) { e.preventDefault(); e.stopPropagation(); } };
    const onDragStart = (e) => e.preventDefault();

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('pointermove', onBrush);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('click', onClick, true);
    stage.addEventListener('dragstart', onDragStart);
    return () => {
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('pointermove', onBrush);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('click', onClick, true);
      stage.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      finish();
    };
  }, [stageRef, reduced, soundRef]);
}

function Pass({ pass, delivered }) {
  const Icon = pass.icon;
  return (
    <div className="lp-slot" style={{ '--d': pass.d }}>
      <div className="lp-hang" style={{ '--r': `${pass.r}deg`, '--strap': pass.strap }}>
        <span className="lp-strap" aria-hidden="true" />
        <Link to={pass.to} className={`lp-pass${pass.dark ? ' dark' : ''}${pass.flip ? ' flip' : ''}`} style={{ '--chip': pass.chip }} aria-label={`${pass.name}: view packages`}>
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
  const [sound, setSound] = useState(readSound);
  const soundRef = useRef(sound);
  soundRef.current = sound;
  usePassPhysics(stage, reduced, soundRef);
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    try { localStorage.setItem(SOUND_KEY, next ? '1' : '0'); } catch { /* storage is optional */ }
  };

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
          {!reduced && (
            <>
              <p className="lp-hint lp-mono" aria-hidden="true"><Hand size={16} />Drag the cards</p>
              <button type="button" className="lp-sound" onClick={toggleSound} aria-pressed={sound} aria-label="Card sounds">
                {sound ? <Volume size={16} /> : <Mute size={16} />}
                <span>{sound ? 'Sound on' : 'Sound off'}</span>
              </button>
            </>
          )}
          <div className="lp-rig">
            <span className="lp-ring" aria-hidden="true" />
            {PASSES.map((p) => <Pass key={p.id} pass={p} delivered={delivered} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
