import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CtaActionsProvider } from './contexts/CtaActionsContext';
import HomePage from './pages/HomePage';
import BuyYouTubeViewsPage from './pages/BuyYouTubeViewsPage';
import BuyYouTubeSubscribersPage from './pages/BuyYouTubeSubscribersPage';
import BuyYouTubeLikesPage from './pages/BuyYouTubeLikesPage';
import BuyYouTubeWatchHoursPage from './pages/BuyYouTubeWatchHoursPage';
import BuyTikTokFollowersPage from './pages/BuyTikTokFollowersPage';
import BuyTikTokAdsViewsPage from './pages/BuyTikTokAdsViewsPage';
import BuyTikTokReachPage from './pages/BuyTikTokReachPage';
import BuyTikTokEngagementPage from './pages/BuyTikTokEngagementPage';
import BuyTikTokVideoViewsPage from './pages/BuyTikTokVideoViewsPage';
import BuyTikTokTrafficPage from './pages/BuyTikTokTrafficPage';
import BuyGoogleSkipAdsViewsPage from './pages/BuyGoogleSkipAdsViewsPage';
import BuyGoogleDisplayAdsViewsPage from './pages/BuyGoogleDisplayAdsViewsPage';

import BuyGoogleAppsDownloadPage from './pages/BuyGoogleAppsDownloadPage';
import BuyGoogleAdsWebsiteTrafficPage from './pages/BuyGoogleAdsWebsiteTrafficPage';
import BuyFemaleGoogleReviewsPage from './pages/BuyFemaleGoogleReviewsPage';
import BuyMaleGoogleReviewsPage from './pages/BuyMaleGoogleReviewsPage';
import BuyGoogleLocalGuideReviewsPage from './pages/BuyGoogleLocalGuideReviewsPage';
import BuyGoogleReviewsByAgeGroupPage from './pages/BuyGoogleReviewsByAgeGroupPage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import CookiesSettingsPage from './pages/CookiesSettingsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import GetStartedPage from './pages/GetStartedPage';
import GoogleReviewsGetStartedGeneric from './pages/GoogleReviewsGetStartedGeneric';
import GoogleReviewsUpgradeGeneric from './pages/GoogleReviewsUpgradeGeneric';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContentWithProviders() {
  const { user } = useAuth();
  return (
    <CtaActionsProvider userId={user?.id}>
      <AppContent />
    </CtaActionsProvider>
  );
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy-youtube-views" element={<BuyYouTubeViewsPage />} />
        <Route path="/buy-youtube-subscribers" element={<BuyYouTubeSubscribersPage />} />
        <Route path="/buy-youtube-likes" element={<BuyYouTubeLikesPage />} />
        <Route path="/buy-youtube-watch-hours" element={<BuyYouTubeWatchHoursPage />} />
        <Route path="/buy-tiktok-followers" element={<BuyTikTokFollowersPage />} />
        <Route path="/buy-tiktok-ads-views" element={<BuyTikTokAdsViewsPage />} />
        <Route path="/buy-tiktok-reach" element={<BuyTikTokReachPage />} />
        <Route path="/buy-tiktok-engagement" element={<BuyTikTokEngagementPage />} />
        <Route path="/buy-tiktok-video-views" element={<BuyTikTokVideoViewsPage />} />
        <Route path="/buy-tiktok-traffic" element={<BuyTikTokTrafficPage />} />
        <Route path="/buy-google-skip-ads-views" element={<BuyGoogleSkipAdsViewsPage />} />
        <Route path="/buy-google-display-ads-views" element={<BuyGoogleDisplayAdsViewsPage />} />

        <Route path="/buy-google-apps-download" element={<BuyGoogleAppsDownloadPage />} />
        <Route path="/buy-google-ads-website-traffic" element={<BuyGoogleAdsWebsiteTrafficPage />} />
        <Route path="/buy-female-google-reviews" element={<BuyFemaleGoogleReviewsPage />} />
        <Route path="/buy-male-google-reviews" element={<BuyMaleGoogleReviewsPage />} />
        <Route path="/buy-google-local-guide-reviews" element={<BuyGoogleLocalGuideReviewsPage />} />
        <Route path="/buy-google-reviews-by-age-group" element={<BuyGoogleReviewsByAgeGroupPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/refunds" element={<RefundPolicyPage />} />
        <Route path="/cookies" element={<CookiesSettingsPage />} />
        <Route path="/cookies-settings" element={<CookiesSettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/google-reviews/get-started" element={<GoogleReviewsGetStartedGeneric />} />
        <Route path="/google-reviews/upgrade" element={<GoogleReviewsUpgradeGeneric />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContentWithProviders />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
