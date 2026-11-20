// For the few pages the revamp doesn't have (order detail, payment result, shared payment links, 404):
// the revamp's own nav and footer (borrowed from its Terms page) around the existing page content.
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import RevampPage from './RevampPage';

export default function RevampShell({ title, description, children }) {
  const [slot, setSlot] = useState(null);
  const borrow = (root) => {
    const main = root.querySelector('main');
    if (!main) return undefined;
    const hidden = Array.from(main.children);
    hidden.forEach((el) => { el.style.display = 'none'; });
    const host = document.createElement('div');
    host.className = 'site revamp-shell-slot';
    main.appendChild(host);
    setSlot(host);
    return () => { host.remove(); hidden.forEach((el) => { el.style.display = ''; }); setSlot(null); };
  };
  return (
    <RevampPage pageKey="terms" title={title} description={description} onReady={borrow}>
      {slot && createPortal(children, slot)}
    </RevampPage>
  );
}
