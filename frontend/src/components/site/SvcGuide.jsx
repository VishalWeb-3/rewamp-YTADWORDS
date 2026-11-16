import React, { Children, useId, useRef, useState } from 'react';

// One topic of the guide. Renders nothing itself; SvcGuide reads its props.
export function SvcTopic() { return null; }

const isStock = (src) => typeof src === 'string' && /demo[12]\.jpg$/.test(src);

// Long-form service copy as one tabbed panel: the reader picks a topic instead of scrolling past every essay.
// Inactive panels stay in the DOM (hidden) so the copy is still indexed.
export default function SvcGuide({ heading = 'Good to know before you buy', children }) {
  const topics = Children.toArray(children).filter((c) => c?.props?.title);
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const id = useId();

  const onKey = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next = null;
    if (step) next = (active + step + topics.length) % topics.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = topics.length - 1;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  if (!topics.length) return null;

  return (
    <section className="svc-guide lp-reveal">
      <div className="svc-sec-head">
        <p className="svc-kicker">Learn more</p>
        <h2>{heading}</h2>
      </div>
      <div className="svc-guide-body">
        <div className="svc-guide-tabs" role="tablist" aria-orientation="vertical" aria-label={heading}>
          {topics.map((t, i) => (
            <button
              key={i}
              ref={(el) => { tabs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-panel-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
            >
              <span className="svc-guide-num">{String(i + 1).padStart(2, '0')}</span>
              <span>{t.props.title}</span>
            </button>
          ))}
        </div>
        {topics.map((t, i) => (
          <div
            key={i}
            role="tabpanel"
            id={`${id}-panel-${i}`}
            aria-labelledby={`${id}-tab-${i}`}
            hidden={i !== active}
            className="svc-guide-panel"
          >
            <h3>{t.props.title}</h3>
            {t.props.image && !isStock(t.props.image) && <img src={t.props.image} alt="" loading="lazy" />}
            {t.props.children}
          </div>
        ))}
      </div>
    </section>
  );
}
