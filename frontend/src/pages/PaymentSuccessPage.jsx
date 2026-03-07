import React, { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';

/* ─── CSS injected once ─── */
const STYLE = `
@keyframes ps-fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes ps-scaleIn  { from { opacity:0; transform:scale(0.7) } to   { opacity:1; transform:scale(1) } }
@keyframes ps-pulse    { 0%,100% { transform:scale(1);   opacity:.45 } 50% { transform:scale(1.38); opacity:0 } }
@keyframes ps-fall     {
  0%   { opacity:0;  transform:translateY(0)   rotate(0deg) }
  10%  { opacity:1                                           }
  90%  { opacity:1                                           }
  100% { opacity:0;  transform:translateY(620px) rotate(540deg) }
}
@keyframes ps-shimmer  { 0%,100% { opacity:1 } 50% { opacity:.55 } }

.ps-fadeUp  { animation: ps-fadeUp  .5s ease both }
.ps-scaleIn { animation: ps-scaleIn .55s cubic-bezier(.22,1,.36,1) both }
.ps-pulse   { animation: ps-pulse   2.4s ease-in-out infinite }
.ps-shimmer { animation: ps-shimmer 2.2s ease-in-out infinite }

.ps-card { box-shadow: 0 4px 6px -1px rgba(0,0,0,.06), 0 20px 60px -10px rgba(0,0,0,.12) }
.ps-step { box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 4px 12px -2px rgba(0,0,0,.05) }
.ps-confetti { position:fixed; top:-24px; pointer-events:none; z-index:9999; animation:ps-fall linear both }
`;

/* ─── Confetti ─── */
const COLORS = ['#4ade80','#3b82f6','#a855f7','#fbbf24','#fb923c','#f472b6','#34d399','#ef4444'];

function Confetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const arr = Array.from({ length: 65 }, (_, i) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size  = Math.random() * 10 + 6;
      const isRect = Math.random() > 0.66;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          width:  isRect ? `${size * 2.2}px` : `${size}px`,
          height: `${size}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: color,
          animationDuration: `${2.8 + Math.random() * 1.8}s`,
          animationDelay: `${Math.random() * 1.4}s`,
          transform: `translateX(${(Math.random() - 0.5) * 140}px)`,
        },
      };
    });
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 5200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="ps-confetti" style={p.style} />
      ))}
    </>
  );
}

/* ─── Step badge ─── */
function StepBadge({ number, label, desc, delay, icon }) {
  return (
    <div
      className="ps-fadeUp ps-step flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100"
      style={{ animationDelay: delay }}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
          {number}
        </span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight leading-tight">{label}</p>
        <p className="text-xs font-medium text-gray-500 mt-0.5 leading-snug">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Trust badge ─── */
function TrustBadge({ label, icon }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-tight max-w-[72px]">
        {label}
      </span>
    </div>
  );
}

/* ─── Inline SVG icons ─── */
const IconZap = (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconTrending = (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconMail = (
  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconShield = (
  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconClock = (
  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconGift = (
  <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);
const IconPackage = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconCheck = (
  <svg className="w-14 h-14 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconArrow = (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconChevron = (
  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconSparkles = (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);

/* ─── Main ─── */
export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('order_id');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 5500);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Inject keyframe styles once */}
      <style>{STYLE}</style>

      <SEO
        title="Payment Successful — Thank You! | YoutubeADwords"
        description="Your payment was successful. Your order is now being processed. Thank you for choosing YoutubeADwords!"
      />

      {/* Confetti burst */}
      {showConfetti && <Confetti />}

      {/* Full-page background */}
      <div
        className="min-h-screen flex flex-col items-center justify-center py-16 px-4"
        style={{ background: 'linear-gradient(160deg,#f0f4ff 0%,#fdf4ff 45%,#f0fff4 100%)' }}
      >
        {/* ── Card ── */}
        <div
          className="ps-scaleIn w-full max-w-lg"
          style={{ animationDelay: '0s' }}
        >
          {/* Rainbow top stripe */}
          <div
            className="h-1.5 rounded-t-3xl w-full"
            style={{ background: 'linear-gradient(90deg,#4ade80,#3b82f6,#a855f7,#fb923c,#4ade80)' }}
          />

          <div className="bg-white rounded-b-3xl ps-card overflow-hidden">

            {/* ── Hero section ── */}
            <div
              className="relative px-8 pt-10 pb-8 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#f0f9ff 0%,#fdf4ff 100%)' }}
            >
              {/* Glowing ring + check */}
              <div className="ps-scaleIn relative w-28 h-28 mx-auto mb-6" style={{ animationDelay: '.15s' }}>
                {/* Pulse ring */}
                <div className="ps-pulse absolute inset-0 rounded-full bg-emerald-400/25" />
                <div className="absolute inset-0 rounded-full bg-emerald-100 flex items-center justify-center">
                  {IconCheck}
                </div>
              </div>

              <div className="ps-fadeUp" style={{ animationDelay: '.32s' }}>
                {/* Badge pill */}
                <p className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[.18em] text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-4">
                  {IconSparkles}
                  Order Confirmed
                </p>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3 leading-tight">
                  Thank You! 🎉
                </h1>

                <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                  Your payment was successful and your order is now being processed.
                  We'll get started right away!
                </p>

                {orderId && (
                  <div
                    className="ps-fadeUp inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white border border-gray-200 rounded-xl"
                    style={{ animationDelay: '.55s', boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}
                  >
                    <span className="text-gray-400">{IconPackage}</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Order ID:&nbsp;
                    </span>
                    <span className="text-xs font-black text-gray-900 font-mono">
                      #{orderId.slice(0, 12).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background:'linear-gradient(90deg,transparent,#e5e7eb,transparent)' }} />

            {/* ── Body ── */}
            <div className="px-8 py-7 space-y-6">

              {/* What happens next */}
              <div>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[.18em] mb-3">
                  What Happens Next
                </p>
                <div className="space-y-2.5">
                  <StepBadge
                    number="1"
                    icon={IconZap}
                    label="Instant Processing"
                    desc="Our system picks up your order and queues delivery immediately."
                    delay=".4s"
                  />
                  <StepBadge
                    number="2"
                    icon={IconTrending}
                    label="Delivery Begins"
                    desc="Views, subscribers or reviews start appearing within minutes to hours."
                    delay=".5s"
                  />
                  <StepBadge
                    number="3"
                    icon={IconMail}
                    label="Email Confirmation"
                    desc="A receipt and order summary will be sent to your email."
                    delay=".6s"
                  />
                </div>
              </div>

              {/* Trust row */}
              <div
                className="ps-fadeUp flex items-center justify-around py-4 px-2 bg-gray-50 rounded-2xl border border-gray-100"
                style={{ animationDelay: '.68s' }}
              >
                <TrustBadge icon={IconShield} label="Secure Payment" />
                <div className="w-px h-10 bg-gray-200" />
                <TrustBadge icon={IconClock} label="Fast Delivery" />
                <div className="w-px h-10 bg-gray-200" />
                <TrustBadge icon={IconGift} label="Satisfaction Guarantee" />
              </div>

              {/* Stars */}
              <div className="ps-fadeUp flex items-center justify-center gap-1.5" style={{ animationDelay: '.76s' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
                <span className="text-xs font-black text-gray-400 ml-1">
                  Trusted by 10,000+ customers
                </span>
              </div>

              {/* CTAs */}
              <div className="ps-fadeUp space-y-3 pt-1" style={{ animationDelay: '.84s' }}>
                <Link
                  to="/orders"
                  className="group flex items-center justify-center gap-3 w-full px-6 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wide transition-all duration-200 hover:opacity-90 hover:scale-[1.01]"
                  style={{
                    background: 'linear-gradient(135deg,#E53935 0%,#C62828 100%)',
                    boxShadow: '0 6px 20px -4px rgba(229,57,53,.45)',
                  }}
                >
                  <span>{IconPackage}</span>
                  VIEW MY ORDERS
                  {IconChevron}
                </Link>

                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 text-gray-400 font-black text-xs uppercase tracking-[.2em] hover:text-brand-red transition-colors py-2"
                >
                  Return to Home
                  {IconArrow}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p
          className="ps-fadeUp mt-6 text-xs text-gray-400 font-medium text-center"
          style={{ animationDelay: '1.05s' }}
        >
          Questions? Reach us at{' '}
          <a
            href="mailto:support@youtubeadwords.com"
            className="text-brand-red font-bold hover:underline"
          >
            support@youtubeadwords.com
          </a>
        </p>
      </div>
    </>
  );
}
