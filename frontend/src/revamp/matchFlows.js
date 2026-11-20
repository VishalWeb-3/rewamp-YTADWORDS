// Points the revamp pages' links and footer at the same places as the original site:
//   - links to the revamp's own overview pages go where the original's equivalent button went
//   - footer: Tickets / Support -> /tickets, Refund Policy in the legal row, the original copyright line,
//     and Logout in the Company column while signed in (the original Footer's behaviour)
// Every change is undone by the returned cleanup, so it can re-run when the sign-in state changes.

// revamp-only destination -> the original site's destination for the same button
const LINKS = {
  '/service': '/', // My Orders "Browse services" (original: home)
  '/google-ads': '/buy-google-skip-ads-views', // closing "Google Ads" button (original: "Google Ads views")
};
const LABELS = { '/google-ads': { Google: 'Google Ads views', 'Google Ads': 'Google Ads views' } };

const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();

/** `ctx`: { isLoggedIn, logout, footer } (footer = Tina global footer content). */
export function matchFlows(root, ctx) {
  const undo = [];
  const setAttr = (el, name, value) => {
    const old = el.getAttribute(name);
    el.setAttribute(name, value);
    undo.push(() => el.setAttribute(name, old));
  };
  const setText = (el, value) => {
    const old = el.textContent;
    el.textContent = value;
    undo.push(() => { el.textContent = old; });
  };
  const addAfter = (node, ref) => {
    ref.after(node);
    undo.push(() => node.remove());
  };
  // a footer link's own block (Framer wraps each one in a rich-text container)
  const block = (a) => a.closest('[data-framer-component-type="RichTextContainer"]') || a.closest('p') || a;
  const linkIn = (node) => (node.matches('a') ? node : node.querySelector('a'));
  const footer = ctx.footer || {};

  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (!LINKS[href]) return;
    setAttr(a, 'href', LINKS[href]);
    const labels = LABELS[href];
    if (labels) a.querySelectorAll('p').forEach((p) => { if (labels[text(p)]) setText(p, labels[text(p)]); });
  });

  root.querySelectorAll('footer').forEach((foot) => {
    const links = Array.from(foot.querySelectorAll('a[href]'));
    const byText = (label) => links.find((a) => text(a) === label);

    const tickets = byText('Tickets / Support');
    if (tickets) setAttr(tickets, 'href', '/tickets');

    // legal row: Privacy Policy, Terms of Service, Refund Policy, Cookies Settings
    const cookies = links.find((a) => a.getAttribute('href') === '/cookies');
    if (cookies && !links.some((a) => a.getAttribute('href') === '/refund-policy')) {
      const terms = links.find((a) => a.getAttribute('href') === '/terms') || cookies;
      const refund = block(terms).cloneNode(true);
      const link = linkIn(refund);
      link.setAttribute('href', '/refund-policy');
      link.textContent = footer.refundPolicy || 'Refund Policy';
      addAfter(refund, block(terms));
    }

    // social icons follow the Tina footer links, as the original footer's did
    const SOCIAL_HOSTS = { youtube: /youtube\.com/, pinterest: /pin\.it|pinterest\./, twitter: /x\.com|twitter\.com/, facebook: /facebook\.com/ };
    Object.entries(footer.socials || {}).forEach(([key, url]) => {
      if (!url || !SOCIAL_HOSTS[key]) return;
      links.filter((a) => SOCIAL_HOSTS[key].test(a.getAttribute('href'))).forEach((a) => setAttr(a, 'href', url));
    });

    // copyright line
    Array.from(foot.querySelectorAll('p')).filter((p) => /^©/.test(text(p)) && !p.querySelector('a')).forEach((p) => {
      setText(p, footer.copyright || '© 2026 YoutubeADwords. All rights reserved. | Novence SASU - Cs 48756 Paris');
    });

    // Logout under Company while signed in
    if (ctx.isLoggedIn && tickets) {
      const item = block(tickets).cloneNode(true);
      const link = linkIn(item);
      link.setAttribute('href', '/');
      link.setAttribute('role', 'button');
      link.textContent = 'Logout';
      link.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); ctx.logout(); });
      addAfter(item, block(tickets));
    }
  });

  return () => undo.reverse().forEach((fn) => fn());
}
