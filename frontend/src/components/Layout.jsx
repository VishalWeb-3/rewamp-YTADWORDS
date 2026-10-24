import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingHeader from './landing/LandingHeader';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import SEO from './SEO';
import DiscountPopup from './DiscountPopup';
import NotificationPopup from './NotificationPopup';
import { usePageMetadata } from '../contexts/ContentContext';
import '../styles/landing.css';
import '../styles/site.css';

export default function Layout({ children, variant, seoTitle, seoDescription, seoKeywords, seoOgImage }) {
  const location = useLocation();

  // Get slug from pathname (remove leading slash)
  const slug = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '').replace(/\/$/, '');

  // Fetch metadata from TinaCMS
  const metadata = usePageMetadata(slug);

  // Use metadata from Tina if available, otherwise props, then defaults
  const finalMetadata = metadata;

  const title = finalMetadata?.title || seoTitle || 'YoutubeADwords - Boost Your Google Ads & TikTok Campaigns';
  const description = finalMetadata?.description || seoDescription || 'Experience rapid growth with YoutubeADwords premium traffic solutions. Real views, genuine impressions, and authentic engagement from quality sources worldwide.';
  const keywords = finalMetadata?.keywords || seoKeywords || '';
  const ogImage = finalMetadata?.ogImage || seoOgImage || '/favicon.svg';

  return (
    <div className={`min-h-screen overflow-x-hidden w-full ${variant === 'landing' ? '' : 'site'}`}>
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
      <NotificationPopup />
    </div>
  );
}
