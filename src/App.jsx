import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BuyYouTubeViewsPage from './pages/BuyYouTubeViewsPage';
import BuyYouTubeSubscribersPage from './pages/BuyYouTubeSubscribersPage';
import BuyYouTubeLikesPage from './pages/BuyYouTubeLikesPage';
import BuyYouTubeWatchHoursPage from './pages/BuyYouTubeWatchHoursPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy-youtube-views" element={<BuyYouTubeViewsPage />} />
        <Route path="/buy-youtube-subscribers" element={<BuyYouTubeSubscribersPage />} />
        <Route path="/buy-youtube-likes" element={<BuyYouTubeLikesPage />} />
        <Route path="/buy-youtube-watch-hours" element={<BuyYouTubeWatchHoursPage />} />
      </Routes>
    </Router>
  );
}
