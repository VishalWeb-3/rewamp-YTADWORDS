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

const CARD = '.svc-guarantee .bg-white.rounded-2xl';
const FORM = '.svc-review-form';

// Long guarantee copy is clipped to a few lines (CSS) and the review form starts folded; both open on click.
// The page markup differs per service, so this arms whatever is there instead of each page wiring it up.
function armFolds(root) {
  root.querySelectorAll(CARD).forEach((card) => {
    const p = card.querySelector('p');
    if (!p || card.dataset.fold === 'open') return;
    const clipped = p.scrollHeight > p.clientHeight + 2;
    if (clipped) {
      card.dataset.fold = 'closed';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');
    } else if (card.dataset.fold) {
      delete card.dataset.fold;
      card.removeAttribute('tabindex');
      card.removeAttribute('role');
      card.removeAttribute('aria-expanded');
    }
  });
  const form = root.querySelector(FORM);
  const head = form?.querySelector('h2');
  if (head && !form.dataset.fold) {
    form.dataset.fold = 'closed';
    head.tabIndex = 0;
    head.setAttribute('role', 'button');
    head.setAttribute('aria-expanded', 'false');
  }
}

function toggleFold(e) {
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest(`${CARD}[data-fold]`);
  const head = !card && e.target.closest(`${FORM} h2[role="button"]`);
  const box = card || head?.closest(FORM);
  if (!box) return;
  e.preventDefault();
  const open = box.dataset.fold !== 'open';
  box.dataset.fold = open ? 'open' : 'closed';
  (card || head).setAttribute('aria-expanded', String(open));
}

// Sticky "on this page" bar for the service pages. It finds the sections already on the page,
// so each page only has to drop it in; short pages (under four sections) don't get one.
export default function SvcNav() {
  const ref = useRef(null);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const root = ref.current?.closest('.site') || document.body;
    let t;
    const arm = () => { clearTimeout(t); t = setTimeout(() => armFolds(root), 60); };
    arm();
    // CMS copy arrives after first paint and swaps the card text, so re-measure when it changes
    const mo = new MutationObserver(arm);
    root.querySelectorAll('.svc-guarantee').forEach((el) => mo.observe(el, { childList: true, subtree: true, characterData: true }));
    window.addEventListener('resize', arm);
    root.addEventListener('click', toggleFold);
    root.addEventListener('keydown', toggleFold);
    return () => {
      clearTimeout(t);
      mo.disconnect();
      window.removeEventListener('resize', arm);
      root.removeEventListener('click', toggleFold);
      root.removeEventListener('keydown', toggleFold);
    };
  }, []);

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
