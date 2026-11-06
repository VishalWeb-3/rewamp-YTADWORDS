import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LandingHeader from './landing/LandingHeader';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import SEO from './SEO';
import DiscountPopup from './DiscountPopup';
import { usePageMetadata } from '../contexts/ContentContext';
import '../styles/landing.css';
import '../styles/site.css';
import '../styles/pages.css';
import '../styles/mobile.css';

export default function Layout({ children, variant, seoTitle, seoDescription, seoKeywords, seoOgImage }) {
  const location = useLocation();
  const rootRef = useRef(null);

  // Inner pages: arm .lp-reveal blocks as they scroll in, including ones that render after content loads
  useEffect(() => {
    const root = rootRef.current;
    if (!root || variant === 'landing') return undefined;
    root.classList.add('lp-js');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    const seen = new WeakSet();
    const scan = () => root.querySelectorAll('.lp-reveal:not(.is-in)').forEach((el) => {
      if (!seen.has(el)) { seen.add(el); io.observe(el); }
    });
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [variant, location.pathname]);

  // Get slug from pathname (remove leading slash)
  const slug = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '').replace(/\/$/, '');

  // Metadata edited in Tina (content/pages/<slug>.mdx); pages can still set their own <SEO>
  const finalMetadata = usePageMetadata(slug);

  const title = finalMetadata?.title || seoTitle || 'YoutubeADwords - Boost Your Google Ads & TikTok Campaigns';
  const description = finalMetadata?.description || seoDescription || 'Experience rapid growth with YoutubeADwords premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide.';
  const keywords = finalMetadata?.keywords || seoKeywords || '';
  const ogImage = finalMetadata?.ogImage || seoOgImage || '/favicon.svg';

  return (
    <div ref={rootRef} className={`min-h-screen overflow-x-hidden w-full ${variant === 'landing' ? '' : 'site'}`}>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
      />
      <LandingHeader />
      {children}
      <Footer />
      <CartSidebar />
      <DiscountPopup />
    </div>
  );
}
