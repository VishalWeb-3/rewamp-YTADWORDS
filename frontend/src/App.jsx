import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CtaActionsProvider } from './contexts/CtaActionsContext';
import HomePage from './pages/HomePage';
const BuyYouTubeViewsPage = lazy(() => import('./pages/BuyYouTubeViewsPage'));
const BuyYouTubeSubscribersPage = lazy(() => import('./pages/BuyYouTubeSubscribersPage'));
const BuyYouTubeLikesPage = lazy(() => import('./pages/BuyYouTubeLikesPage'));
const BuyYouTubeWatchHoursPage = lazy(() => import('./pages/BuyYouTubeWatchHoursPage'));
const BuyGoogleSkipAdsViewsPage = lazy(() => import('./pages/BuyGoogleSkipAdsViewsPage'));
const BuyGoogleDisplayAdsViewsPage = lazy(() => import('./pages/BuyGoogleDisplayAdsViewsPage'));

const BuyGoogleAppsDownloadPage = lazy(() => import('./pages/BuyGoogleAppsDownloadPage'));
const BuyGoogleAdsWebsiteTrafficPage = lazy(() => import('./pages/BuyGoogleAdsWebsiteTrafficPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const CookiesSettingsPage = lazy(() => import('./pages/CookiesSettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentFailurePage = lazy(() => import('./pages/PaymentFailurePage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const SharedPaymentPage = lazy(() => import('./pages/SharedPaymentPage'));
const PayLinkPage = lazy(() => import('./pages/PayLinkPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy-youtube-views" element={<BuyYouTubeViewsPage />} />
        <Route path="/buy-youtube-subscribers" element={<BuyYouTubeSubscribersPage />} />
        <Route path="/buy-youtube-likes" element={<BuyYouTubeLikesPage />} />
        <Route path="/buy-youtube-watch-hours" element={<BuyYouTubeWatchHoursPage />} />
        <Route path="/buy-google-skip-ads-views" element={<BuyGoogleSkipAdsViewsPage />} />
        <Route path="/buy-google-display-ads-views" element={<BuyGoogleDisplayAdsViewsPage />} />

        <Route path="/buy-google-apps-download" element={<BuyGoogleAppsDownloadPage />} />
        <Route path="/buy-google-ads-website-traffic" element={<BuyGoogleAdsWebsiteTrafficPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact-us" element={<ContactPage />} />
        <Route path="/tickets" element={<ContactPage />} />
        <Route path="/support" element={<ContactPage />} />
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
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/failure" element={<PaymentFailurePage />} />
        <Route path="/pay" element={<SharedPaymentPage />} />
        <Route path="/pay/:token" element={<PayLinkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
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
