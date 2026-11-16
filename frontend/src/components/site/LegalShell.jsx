import React, { useEffect, useRef, useState } from 'react';
import PageHead from './PageHead';

export const slugify = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Legal pages: a sticky contents rail beside the text, highlighting the section being read.
export default function LegalShell({ title, lastUpdated, headings = [], children }) {
  const [active, setActive] = useState(slugify(headings[0]));
  const key = headings.join('|');
  const tocRef = useRef(null);

  useEffect(() => {
    const els = key.split('|').map((h) => document.getElementById(slugify(h))).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-20% 0px -65% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  // on phones the rail is a sideways chip bar: keep the current chip in view
  useEffect(() => {
    const list = tocRef.current;
    const chip = list?.querySelector('[aria-current="true"]');
    if (chip && list.scrollWidth > list.clientWidth) list.scrollTo({ left: chip.offsetLeft - 20, behavior: 'smooth' });
  }, [active]);

  return (
    <div className="pg-wrap pg-legal">
      <PageHead title={title} lede={lastUpdated ? `Last updated ${lastUpdated}` : undefined} size="md" />
      <div className="pg-legal-grid">
        <nav className="pg-toc pg-in" style={{ '--d': '0.55s' }} aria-label="On this page">
          <p>On this page</p>
          <ol ref={tocRef}>
            {headings.map((h) => {
              const id = slugify(h);
              return (
                <li key={id}>
                  <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{h}</a>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="pg-legal-body pg-in" style={{ '--d': '0.4s' }}>{children}</div>
      </div>
    </div>
  );
}
