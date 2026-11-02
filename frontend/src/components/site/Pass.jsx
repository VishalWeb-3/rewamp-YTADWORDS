import React from 'react';

// The landing page's lanyard credential, reused on inner pages as their one signature object.
// tone: 'light' | 'dark' | 'void'. hang: draw the strap and ring above it.
export default function Pass({
  kind = 'Service pass',
  serial,
  title,
  rows = [],
  tone = 'light',
  hang = true,
  swing = false,
  strap,
  stamp,
  className = '',
  children,
}) {
  return (
    <div className={`pg-pass-rig${swing ? ' is-swing' : ''}${hang ? ' has-strap' : ''} ${className}`} style={strap ? { '--strap': strap } : undefined}>
      {hang && <span className="pg-pass-strap" aria-hidden="true"><i className="pg-pass-ring" /></span>}
      <div className={`pg-pass pg-pass-${tone}`}>
        <span className="pg-pass-slot" aria-hidden="true" />
        <div className="pg-pass-top lp-mono">
          <span>{kind}</span>
          {serial && <span>{serial}</span>}
        </div>
        {title && <p className="pg-pass-title lp-display">{title}</p>}
        {rows.length > 0 && (
          <dl className="pg-pass-rows">
            {rows.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd className={r.mono ? 'lp-mono' : undefined}>{r.value || <span className="pg-pass-blank">&nbsp;</span>}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
        <div className="lp-holo pg-pass-holo" aria-hidden="true" />
        {stamp && <span className="pg-pass-stamp" aria-hidden="true">{stamp}</span>}
      </div>
    </div>
  );
}
