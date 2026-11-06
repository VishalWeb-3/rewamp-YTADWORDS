import React from 'react';

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Arrow = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Check = ({ size = 20 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
);
export const Hand = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-5.9-2.4L3.4 16a2 2 0 0 1 3.2-2.4L8 15" /></svg>
);
export const Volume = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>
);
export const Mute = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" /></svg>
);
export const Cross = ({ size = 18 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const Chevron = ({ size = 16 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
);
export const Bag =({ size = 22 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V7a3 3 0 0 1 6 0v1" /></svg>
);
export const Menu = ({ size = 22 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

const solid = { fill: 'currentColor', 'aria-hidden': true };
export const YouTube = ({ size = 22 }) => (
  <svg {...solid} width={size} height={size} viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>
);
export const Star = ({ size = 22 }) => (
  <svg {...solid} width={size} height={size} viewBox="0 0 24 24"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.3L7 14.2 2 9.3l6.9-1L12 2Z" /></svg>
);
export const GoogleG = ({ size = 22 }) => (
  <svg {...base} strokeWidth={2.4} width={size} height={size} viewBox="0 0 24 24"><path d="M20 12h-8M19 7.5A8 8 0 1 0 20 12" /></svg>
);
