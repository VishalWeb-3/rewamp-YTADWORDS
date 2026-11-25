// Behaviour for the imported revamp pages, ported from the revamp's components/TemplateInteractions.tsx:
// responsive variants, Framer entrance motion, button hover, FAQ accordion, case selector, curved and
// straight tickers, and the phone menu. Layout, type and artwork all come from the page's own CSS.
// Form submission is wired separately (see wireForms.js) so it reaches this site's API.
import { animate, inView } from 'framer-motion';

const all = (root, selector) => Array.from(root.querySelectorAll(selector));
const marqueeTrackSelector = 'ul[style*="flex-direction:row"],ul[style*="flex-direction: row"]';

const MENU_GROUPS = [
  ['YouTube services', [['Buy YouTube Views', '/buy-youtube-views'], ['Buy YouTube Subscribers', '/buy-youtube-subscribers'], ['Buy YouTube Likes', '/buy-youtube-likes'], ['Buy YouTube Watch Hours', '/buy-youtube-watch-hours']]],
  ['Google Ads services', [['Google Skip Ads Views', '/buy-google-skip-ads-views'], ['Google Display Ads Views', '/buy-google-display-ads-views'], ['Google Apps Download', '/buy-google-apps-download'], ['Website / App Traffic', '/buy-google-ads-website-traffic']]],
  ['Company', [['About Us', '/about-us'], ['Blog', '/blog'], ['Tickets / Support', '/tickets']]],
];

/**
 * Arms every behaviour inside `root`; returns a cleanup function.
 * `account` is { isLoggedIn, logout } so the phone menu offers Login or Logout like the header does.
 */
export function runInteractions(root, { account } = {}) {
  const cleanups = [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const listen = (el, event, handler, options) => {
    el.addEventListener(event, handler, options);
    cleanups.push(() => el.removeEventListener(event, handler, options));
  };
  const action = (el, callback, label) => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    if (label) el.setAttribute('aria-label', label);
    listen(el, 'click', callback);
    listen(el, 'keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); callback(); } });
  };

  const responsive = () => {
    all(root, '[data-responsive-variants]').forEach((el) => {
      const variants = JSON.parse(el.dataset.responsiveVariants);
      const selected = variants.find((v) => window.matchMedia(v.mediaQuery).matches);
      if (selected) {
        variants.forEach((v) => el.classList.remove(`framer-${v.hash}`));
        el.classList.add(`framer-${selected.hash}`);
      }
    });
  };
  responsive();
  listen(window, 'resize', responsive);

  // Phone rhythm: Framer's phone breakpoint keeps desktop-sized section padding; tag those sections
  // so the phone stylesheet can tighten them.
  const phone = window.matchMedia('(max-width: 809.98px)');
  const tagRhythm = () => {
    if (!phone.matches) return;
    all(root, 'section').forEach((sec) => {
      if (sec.dataset.yawPt || sec.dataset.yawPb || !sec.offsetHeight) return;
      const cs = getComputedStyle(sec);
      if (parseFloat(cs.paddingTop) >= 96) sec.dataset.yawPt = '1';
      if (parseFloat(cs.paddingBottom) >= 96) sec.dataset.yawPb = '1';
    });
  };
  tagRhythm();
  listen(phone, 'change', tagRhythm);

  // Original Framer entrance settings (spring timing and transforms).
  if (!reduced) all(root, '[data-motion-from]').forEach((el) => {
    const from = el.dataset.motionFrom || 'translateY(20px)';
    const to = el.dataset.motionTo || 'none';
    let transition = { duration: 0.8, delay: 0 };
    if (el.dataset.entrance) {
      const variants = JSON.parse(el.dataset.entrance);
      const chosen = Object.keys(variants).find((k) => k !== 'default' && root.querySelector(`.framer-${k}`));
      const config = variants[chosen || 'default'] || Object.values(variants)[0];
      transition = { ...transition, ...config.animate.transition };
      if (config.animate.rotate) el.dataset.motionTo = `${config.transformTemplate?.includes('translateX(-50%)') ? 'translateX(-50%) ' : ''}rotate(${config.animate.rotate}deg)`;
    }
    // Marquee tracks own their transform; animating it here would stop the loop, so they only fade in.
    const isTrack = el.matches(marqueeTrackSelector);
    el.style.opacity = '0';
    if (!isTrack) el.style.transform = from;
    const stop = inView(el, () => {
      const control = animate(el, isTrack ? { opacity: [0, 1] } : { opacity: [0, 1], transform: [from, el.dataset.motionTo || to] }, { ...transition, ease: [0.22, 1, 0.36, 1] });
      cleanups.push(() => control.stop());
    }, { amount: 0.08 });
    cleanups.push(stop);
  });

  // Button labels roll vertically and the raised face depresses on hover.
  all(root, 'a[data-reset="button"],button[data-reset="button"]').forEach((button) => {
    const face = button.querySelector('[data-framer-name="Hover Text"]');
    if (!face) return;
    listen(button, 'mouseenter', () => { animate(face, { y: 3 }, { duration: 0.2 }); });
    listen(button, 'mouseleave', () => { animate(face, { y: 0 }, { duration: 0.2 }); });
  });

  // FAQ accordion with the source component's variants and measured-height motion.
  all(root, '.framer-40u7o').forEach((card, index) => {
    const question = card.querySelector('[data-framer-name="Question"]');
    const answer = card.querySelector('[data-framer-name="Answer"]');
    const icon = question?.querySelector('[data-framer-name="Icon"]');
    if (!question || !answer) return;
    let open = card.dataset.framerName === 'Open';
    const id = `faq-${index}`;
    answer.id = id;
    question.setAttribute('aria-controls', id);
    const render = (instant = false) => {
      question.setAttribute('aria-expanded', String(open));
      card.classList.toggle('framer-v-18b433x', open);
      card.classList.toggle('framer-v-myk8ro', !open);
      card.style.backgroundColor = open ? '#f6e1cc' : 'transparent';
      card.style.boxShadow = open ? '0 6px 0 #000' : 'none';
      ['bottom', 'top', 'left', 'right'].forEach((side) => card.style.setProperty(`--border-${side}-width`, open ? '1px' : '0px'));
      card.style.setProperty('--border-color', open ? '#1a160a' : 'transparent');
      answer.style.overflow = 'hidden';
      answer.style.height = open ? 'auto' : '0px';
      answer.style.opacity = open ? '1' : '0';
      if (!instant && open && !reduced) animate(answer, { height: [0, answer.scrollHeight], opacity: [0, 1] }, { duration: 0.3, onComplete: () => { answer.style.height = 'auto'; } });
      if (icon) {
        icon.style.backgroundColor = open ? '#e8442e' : '#1a160a';
        animate(icon, { rotate: open ? 135 : 0 }, { duration: instant ? 0 : 0.25 });
      }
      const line = card.querySelector(':scope > [data-framer-name="Line"]');
      if (line) line.style.opacity = open ? '0' : '1';
    };
    render(true);
    action(question, () => { open = !open; render(); });
  });

  // Case-study panels with keyboard-accessible selectors.
  all(root, '.framer-MaY1h').forEach((carousel) => {
    const left = carousel.querySelector(':scope > [data-framer-name="Left"]');
    const right = carousel.querySelector(':scope > [data-framer-name="Right"]');
    if (!left || !right) return;
    const tabs = all(left, ':scope > [data-framer-name^="Case "]');
    const panels = all(right, ':scope > [data-framer-name^="Case "]');
    let selected = 0;
    const select = (index, initial = false) => {
      selected = Math.max(0, Math.min(panels.length - 1, index));
      panels.forEach((panel, i) => {
        panel.dataset.casePanel = '';
        panel.hidden = i !== selected;
        panel.style.position = i === selected ? 'relative' : 'absolute';
        panel.style.opacity = i === selected ? '1' : '0';
        if (i === selected && !initial && !reduced) animate(panel, { opacity: [0, 1], y: [12, 0] }, { duration: 0.35 });
      });
      tabs.forEach((tab, i) => { tab.dataset.caseTab = ''; tab.setAttribute('aria-selected', String(i === selected)); });
    };
    tabs.forEach((tab, i) => action(tab, () => select(i), `Show ${tab.textContent?.trim()}`));
    all(carousel, '[data-framer-name="Left Arrow"],[data-framer-name="Right Arrow"]').forEach((arrow) => {
      const next = arrow.dataset.framerName === 'Right Arrow';
      arrow.dataset.caseArrow = '';
      action(arrow, () => select((selected + (next ? 1 : -1) + panels.length) % panels.length), next ? 'Next case study' : 'Previous case study');
    });
    select(0, true);
  });

  // The curved ticker's path stops short of very wide screens; extend both ends flat to the edges.
  all(root, '[data-framer-name="Curved Ticker"] svg').forEach((svg) => {
    const paths = all(svg, 'path');
    const original = paths[0]?.getAttribute('d');
    if (!original) return;
    const points = [...original.matchAll(/[ML]\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
    if (points.length < 2) return;
    const [first, last] = [points[0], points[points.length - 1]];
    const viewBoxWidth = svg.viewBox.baseVal?.width || 1200;
    const fit = () => {
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      if (!width || !height) return;
      const scale = Math.min(width / viewBoxWidth, height / (svg.viewBox.baseVal?.height || 140));
      const half = width / scale / 2 + 40;
      const leftX = viewBoxWidth / 2 - half;
      const rightX = viewBoxWidth / 2 + half;
      let d = original;
      if (leftX < first[0]) d = `M${leftX.toFixed(2)} ${first[1]} L${d.replace(/^M\s*/, '')}`;
      if (rightX > last[0]) d += ` L${rightX.toFixed(2)} ${last[1]}`;
      paths.forEach((path) => path.setAttribute('d', d));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(svg);
    cleanups.push(() => { observer.disconnect(); paths.forEach((path) => path.setAttribute('d', original)); });
  });
  if (!reduced) all(root, 'textPath').forEach((textPath) => {
    const distance = textPath.getComputedTextLength() / 4;
    if (!distance) return;
    const control = animate(0, -distance, { duration: distance / 70, ease: 'linear', repeat: Infinity, onUpdate: (value) => textPath.setAttribute('startOffset', String(value)) });
    cleanups.push(() => control.stop());
  });

  // Continuous tracks: the title ticker drifts left-to-right; the client cards drift right-to-left,
  // pause on hover and can be dragged with momentum.
  if (!reduced) all(root, marqueeTrackSelector).forEach((track) => {
    const items = Array.from(track.children);
    if (!items.length) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const distance = items.reduce((sum, el) => sum + el.getBoundingClientRect().width + gap, 0);
    if (!distance) return;
    const copies = items.map((el) => el.cloneNode(true));
    copies.forEach((el) => { el.setAttribute('aria-hidden', 'true'); track.appendChild(el); });
    const isTitle = !!track.closest('[data-framer-name="Title Ticker"]');
    const direction = isTitle ? 1 : -1;
    const speed = isTitle ? 60 : 30;
    const surface = track.parentElement || track;
    let x = isTitle ? -distance : 0;
    let hovering = false;
    let dragging = false;
    let moved = false;
    let velocity = 0;
    let startX = 0;
    let startOffset = 0;
    let lastX = 0;
    let lastTime = 0;
    let frame = 0;
    let previous = performance.now();
    const wrap = (value) => { const v = value % distance; return v > 0 ? v - distance : v; };
    const tick = (now) => {
      const dt = Math.min(64, now - previous) / 1000;
      previous = now;
      if (!dragging) {
        if (Math.abs(velocity) > 8) { x += velocity * dt; velocity *= Math.pow(0.04, dt); } else { velocity = 0; if (!hovering) x += direction * speed * dt; }
      }
      x = wrap(x);
      track.style.transform = `translate3d(${x}px,0,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    cleanups.push(() => { cancelAnimationFrame(frame); copies.forEach((el) => el.remove()); track.style.transform = ''; });
    if (isTitle) return;
    surface.style.cursor = 'grab';
    surface.style.touchAction = 'pan-y';
    listen(surface, 'mouseenter', () => { hovering = true; });
    listen(surface, 'mouseleave', () => { hovering = false; });
    listen(surface, 'dragstart', (e) => e.preventDefault());
    listen(surface, 'pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true; moved = false; velocity = 0; startX = e.clientX; lastX = e.clientX; startOffset = x; lastTime = performance.now();
      surface.setPointerCapture(e.pointerId);
      surface.style.cursor = 'grabbing';
    });
    listen(surface, 'pointermove', (e) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      x = startOffset + dx;
      if (now > lastTime) velocity = (e.clientX - lastX) / ((now - lastTime) / 1000);
      lastX = e.clientX;
      lastTime = now;
    });
    const release = (e) => {
      if (!dragging) return;
      dragging = false;
      surface.style.cursor = 'grab';
      if (surface.hasPointerCapture(e.pointerId)) surface.releasePointerCapture(e.pointerId);
      if (performance.now() - lastTime > 80) velocity = 0;
      velocity = Math.max(-2500, Math.min(2500, velocity));
    };
    listen(surface, 'pointerup', release);
    listen(surface, 'pointercancel', release);
    // Swallow the click that follows a drag so links inside cards don't fire.
    listen(surface, 'click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  });

  // App-style phone menu: every service one tap away, then company and account links.
  all(root, '[data-framer-name="Menu Button"]').forEach((button) => {
    let menu = null;
    const close = () => {
      menu?.remove();
      menu = null;
      document.documentElement.classList.remove('yaw-locked');
      button.setAttribute('aria-expanded', 'false');
    };
    action(button, () => {
      if (menu) { close(); return; }
      menu = document.createElement('nav');
      menu.className = 'clone-mobile-menu';
      menu.setAttribute('aria-label', 'Main navigation');
      menu.setAttribute('data-lenis-prevent', '');
      MENU_GROUPS.forEach(([title, links]) => {
        const group = document.createElement('div');
        group.className = 'clone-mobile-group';
        const h = document.createElement('p');
        h.textContent = title;
        group.appendChild(h);
        links.forEach(([label, href]) => {
          const a = document.createElement('a');
          a.textContent = label;
          a.href = href;
          if (window.location.pathname === href) a.setAttribute('aria-current', 'page');
          group.appendChild(a);
        });
        menu.appendChild(group);
      });
      const accountRow = document.createElement('div');
      accountRow.className = 'clone-mobile-account';
      const orders = document.createElement('a');
      orders.textContent = 'My Orders';
      orders.href = '/orders';
      accountRow.appendChild(orders);
      if (account?.isLoggedIn) {
        const out = document.createElement('a');
        out.textContent = 'Logout';
        out.href = '/';
        out.addEventListener('click', (e) => { e.preventDefault(); account.logout(); close(); });
        accountRow.appendChild(out);
      } else {
        const login = document.createElement('a');
        login.textContent = 'Login';
        login.href = '/login';
        accountRow.appendChild(login);
      }
      menu.appendChild(accountRow);
      // Any link in the menu closes it (navigation itself is handled by the app's link router).
      menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
      document.body.appendChild(menu);
      document.documentElement.classList.add('yaw-locked');
      button.setAttribute('aria-expanded', 'true');
      if (!reduced) animate(menu, { opacity: [0, 1], y: [-12, 0] }, { duration: 0.25 });
    }, 'Toggle navigation');
    button.setAttribute('aria-expanded', 'false');
    listen(document, 'keydown', (e) => { if (e.key === 'Escape') close(); });
    cleanups.push(close);
  });

  // Phone card rows (the steps and the packages) are wider than the screen. They slide sideways as the
  // page scrolls, carousel-style, so every card passes through view; reduced motion gets a swipeable row.
  let rows = [];
  let rowFrame = 0;
  const slideRows = () => {
    rowFrame = 0;
    if (reduced) return;
    const vh = window.innerHeight;
    rows.forEach((row) => {
      const distance = row.scrollWidth - row.clientWidth;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - row.getBoundingClientRect().top) / (vh * 0.6)));
      row.style.transform = `translate3d(${-progress * distance}px,0,0)`;
    });
  };
  const onScroll = () => { if (!rowFrame) rowFrame = requestAnimationFrame(slideRows); };
  const resetRows = () => rows.forEach((row) => { row.style.transform = ''; row.style.overflowX = ''; });
  const armRows = () => {
    resetRows();
    rows = phone.matches
      ? all(root, 'section[data-framer-name="Solution"] [data-framer-name="Bottom"], section[data-framer-name="Work with me"] [data-framer-name="Bottom"]')
        .filter((row) => getComputedStyle(row).flexDirection === 'row' && row.scrollWidth > row.clientWidth * 1.3)
      : [];
    if (reduced) rows.forEach((row) => { row.style.overflowX = 'auto'; });
    slideRows();
  };
  armRows();
  listen(phone, 'change', armRows);
  listen(window, 'resize', onScroll);
  listen(window, 'scroll', onScroll, { passive: true });
  cleanups.push(() => { cancelAnimationFrame(rowFrame); resetRows(); });

  return () => cleanups.forEach((cleanup) => cleanup());
}
