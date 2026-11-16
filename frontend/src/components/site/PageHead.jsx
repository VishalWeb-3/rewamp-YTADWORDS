import React from 'react';

// Inner-page heading: the landing hero's word-rise on the title, lede and actions fade in after it.
export default function PageHead({ title, lede, children, align = 'left', size = 'lg', className = '' }) {
  const words = String(title || '').split(' ');
  return (
    <header className={`pg-head pg-head-${align} pg-head-${size} ${className}`}>
      <h1 className="lp-display" aria-label={title}>
        {words.map((w, i) => (
          <React.Fragment key={`${w}-${i}`}>
            <span className="w" aria-hidden="true"><span style={{ '--i': i }}>{w}</span></span>
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </h1>
      {lede && <p className="pg-lede">{lede}</p>}
      {children && <div className="pg-head-extra">{children}</div>}
    </header>
  );
}
