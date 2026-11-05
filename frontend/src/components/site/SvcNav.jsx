import React, { useEffect, useRef, useState } from 'react';

const SECTIONS = [
  ['.svc-pass', 'Packages'],
  ['.svc-offer', 'Bundle'],
  ['.svc-guarantee', 'Guarantee'],
  ['.svc-guide', 'Good to know'],
  ['.svc-faq', 'FAQ'],
  ['.svc-compare', 'Compare'],
  ['.svc-reviews', 'Reviews'],
];

// Sticky "on this page" bar for the service pages. It finds the sections already on the page,
// so each page only has to drop it in; short pages (under four sections) don't get one.
export default function SvcNav() {
  const ref = useRef(null);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const root = ref.current?.closest('.site') || document;
    const found = SECTIONS
      .map(([sel, label]) => ({ el: root.querySelector(sel), label }))
      .filter((s) => s.el);
    setItems(found);
    if (found.length < 4) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setCurrent(found.findIndex((s) => s.el === e.target));
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    found.forEach((s) => io.observe(s.el));
    return () => io.disconnect();
  }, []);

  // keep the highlighted chip in view when the bar scrolls sideways on phones
  useEffect(() => {
    const chip = ref.current?.querySelector('[aria-current="true"]');
    const bar = chip?.parentElement;
    if (bar) bar.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
  }, [current]);

  const go = (el) => {
    const y = el.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <nav ref={ref} className="svc-nav" aria-label="On this page" hidden={items.length < 4}>
      <div className="svc-nav-in">
        {items.map((s, i) => (
          <button key={s.label} type="button" aria-current={i === current} onClick={() => go(s.el)}>
            {s.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
