import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CtaActionsProvider } from './contexts/CtaActionsContext';
import LinkRouter from './revamp/LinkRouter';

// The site's pages are the imported Growth Haus revamp (src/revamp, see scripts/import-revamp.mjs).
// Pages the revamp doesn't have keep their existing components below.
const RevampPage = lazy(() => import('./revamp/RevampPage'));
const RevampHome = lazy(() => import('./revamp/HomeHero'));
const RevampBlogList = lazy(() => import('./revamp/RevampBlog').then((m) => ({ default: m.RevampBlogList })));
const RevampBlogPost = lazy(() => import('./revamp/RevampBlog').then((m) => ({ default: m.RevampBlogPost })));
// Login, signup, Get started and Checkout keep the original pages (same flow), shown in the revamp's nav and footer
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const GetStartedPage = lazy(() => import('./pages/GetStartedPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const PaymentSuccessPage = lazy(() => import('./pages/PaymentSuccessPage'));
const PaymentFailurePage = lazy(() => import('./pages/PaymentFailurePage'));
const SharedPaymentPage = lazy(() => import('./pages/SharedPaymentPage'));
const PayLinkPage = lazy(() => import('./pages/PayLinkPage'));
const BuyYouTubeViewsPage = lazy(() => import('./pages/BuyYouTubeViewsPage'));
const BuyYouTubeSubscribersPage = lazy(() => import('./pages/BuyYouTubeSubscribersPage'));
const BuyYouTubeLikesPage = lazy(() => import('./pages/BuyYouTubeLikesPage'));
const BuyYouTubeWatchHoursPage = lazy(() => import('./pages/BuyYouTubeWatchHoursPage'));
const BuyGoogleSkipAdsViewsPage = lazy(() => import('./pages/BuyGoogleSkipAdsViewsPage'));
const BuyGoogleDisplayAdsViewsPage = lazy(() => import('./pages/BuyGoogleDisplayAdsViewsPage'));
const BuyGoogleAppsDownloadPage = lazy(() => import('./pages/BuyGoogleAppsDownloadPage'));
const BuyGoogleAdsWebsiteTrafficPage = lazy(() => import('./pages/BuyGoogleAdsWebsiteTrafficPage'));
const CookiesSettingsPage = lazy(() => import('./pages/CookiesSettingsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// The service pages in the navbar menus, Cookies Settings and the legal pages keep the original pages (content, section order and purchase flow),
// shown inside the revamp shell and theme.
const SERVICE_ROUTES = [
  ['/buy-youtube-views', BuyYouTubeViewsPage],
  ['/buy-youtube-subscribers', BuyYouTubeSubscribersPage],
  ['/buy-youtube-likes', BuyYouTubeLikesPage],
  ['/buy-youtube-watch-hours', BuyYouTubeWatchHoursPage],
  ['/buy-google-skip-ads-views', BuyGoogleSkipAdsViewsPage],
  ['/buy-google-display-ads-views', BuyGoogleDisplayAdsViewsPage],
  ['/buy-google-apps-download', BuyGoogleAppsDownloadPage],
  ['/buy-google-ads-website-traffic', BuyGoogleAdsWebsiteTrafficPage],
  // the original cookie preferences (switches and Save Preferences), which the revamp's page doesn't have
  ['/cookies', CookiesSettingsPage],
  ['/cookies-settings', CookiesSettingsPage],
  // the legal pages read their text from Tina (content/legal), so they keep the original pages too
  ['/privacy-policy', PrivacyPolicyPage],
  ['/privacy', PrivacyPolicyPage],
  ['/terms', TermsPage],
  ['/terms-of-service', TermsPage],
  ['/refund-policy', RefundPolicyPage],
  ['/refunds', RefundPolicyPage],
];

// path -> revamp page; metaSlug is the Tina page-metadata entry (content/pages) that still sets title and description
const REVAMP_ROUTES = [
  ['/about', 'about', 'about'],
  ['/about-us', 'about-us', 'about-us'],
  ['/service', 'service', 'service'],
  ['/youtube-services', 'youtube-services', 'youtube-services'],
  ['/google-ads', 'google-ads', 'google-ads'],
  ['/contact', 'contact', 'contact'],
  ['/contact-us', 'contact', 'contact-us'],
  ['/tickets', 'contact', 'contact'],
  ['/support', 'contact', 'contact'],
  ['/orders', 'orders', 'orders'],
  // The revamp's own guides (linked from its home page); every other /blog/:slug is a Tina post
  ...['choosing-youtube-views', 'google-ads-services-explained', 'how-to-place-and-track-an-order', 'youtube-subscriber-packages',
    'youtube-likes-packages', 'youtube-watch-hours-packages', 'google-app-install-packages'].map((slug) => [`/blog/${slug}`, `blog__${slug}`, `blog/${slug}`]),
];

// New pages open at the top; Back/Forward returns to where the reader was on that page.
const scrollPositions = new Map(); // history entry key -> scrollY

function ScrollToTop() {
  const { pathname, key } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    const save = () => scrollPositions.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [key]);
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    const target = navType === 'POP' ? scrollPositions.get(key) ?? 0 : 0;
    // Pages load after the route changes, so wait until the page is tall enough to reach the saved spot
    const start = performance.now();
    let frame = 0;
    const restore = () => {
      const reachable = document.documentElement.scrollHeight - window.innerHeight >= target;
      if (reachable || performance.now() - start > 3000) window.scrollTo(0, target);
      else frame = requestAnimationFrame(restore);
    };
    restore();
    return () => cancelAnimationFrame(frame);
    // Only a page change moves the scroll; key and navType are read for that change
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <LinkRouter />
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Routes>
        <Route path="/" element={<RevampHome key="home" pageKey="home" metaSlug="home" />} />
        {REVAMP_ROUTES.map(([path, pageKey, metaSlug]) => (
          <Route key={path} path={path} element={<RevampPage key={pageKey} pageKey={pageKey} metaSlug={metaSlug} />} />
        ))}
        {SERVICE_ROUTES.map(([path, Page]) => <Route key={path} path={path} element={<Page />} />)}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />
        {/* No reset endpoint: same destination as the login page's "Forgot password?" link */}
        <Route path="/forgot-password" element={<Navigate to="/contact?reason=support&topic=password" replace />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/blog" element={<RevampBlogList />} />
        <Route path="/blog/:slug" element={<RevampBlogPost />} />
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
