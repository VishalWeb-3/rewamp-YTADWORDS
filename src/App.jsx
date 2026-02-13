import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import BuyGoogleDiscoveryAdsViewsPage from './pages/BuyGoogleDiscoveryAdsViewsPage';
import BuyGoogleAdsSearchTrafficPage from './pages/BuyGoogleAdsSearchTrafficPage';
import BuyGoogleAdsWebsiteTrafficPage from './pages/BuyGoogleAdsWebsiteTrafficPage';
import BuyFemaleGoogleReviewsPage from './pages/BuyFemaleGoogleReviewsPage';
import BuyMaleGoogleReviewsPage from './pages/BuyMaleGoogleReviewsPage';
import BuyUSAGoogleReviewsPage from './pages/BuyUSAGoogleReviewsPage';
import BuyGoogleLocalGuideReviewsPage from './pages/BuyGoogleLocalGuideReviewsPage';
import BuyGoogleReviewsByAgeGroupPage from './pages/BuyGoogleReviewsByAgeGroupPage';

export default function App() {
  return (
    <Router>
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
        <Route path="/buy-google-discovery-ads-views" element={<BuyGoogleDiscoveryAdsViewsPage />} />
        <Route path="/buy-google-ads-search-traffic" element={<BuyGoogleAdsSearchTrafficPage />} />
        <Route path="/buy-google-ads-website-traffic" element={<BuyGoogleAdsWebsiteTrafficPage />} />
        <Route path="/buy-female-google-reviews" element={<BuyFemaleGoogleReviewsPage />} />
        <Route path="/buy-male-google-reviews" element={<BuyMaleGoogleReviewsPage />} />
        <Route path="/buy-usa-google-reviews" element={<BuyUSAGoogleReviewsPage />} />
        <Route path="/buy-google-local-guide-reviews" element={<BuyGoogleLocalGuideReviewsPage />} />
        <Route path="/buy-google-reviews-by-age-group" element={<BuyGoogleReviewsByAgeGroupPage />} />
      </Routes>
    </Router>
  );
}
