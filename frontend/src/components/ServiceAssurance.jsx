import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  { title: 'Pick a package', text: 'Choose the amount and add it to your cart, or buy straight away.' },
  { title: 'Send a link, not a password', text: 'We only need your video, profile or place link. We never ask for your login.' },
  { title: 'Track it in My Orders', text: 'Follow delivery from your account and message support if anything looks off.' },
];

export default function ServiceAssurance() {
  // open on desktop, collapsed on phones so the package picker stays near the top
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 64rem)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 64rem)');
    const sync = () => { if (mq.matches) setOpen(true); };
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return (
    <details className="svc-assure" open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary><h2>How your order works</h2></summary>
      <ol>
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <span className="n" aria-hidden="true">{i + 1}</span>
            <div><b>{s.title}</b><p>{s.text}</p></div>
          </li>
        ))}
      </ol>
      <p className="svc-assure-foot">
        Read the <Link to="/refund-policy">refund policy</Link> before you buy, or <Link to="/contact">ask us a question</Link>.
      </p>
    </details>
  );
}
