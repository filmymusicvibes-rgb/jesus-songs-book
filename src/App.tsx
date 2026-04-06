import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { Home, SongDetail, SearchPage, Favorites } from './pages/MainPages';
import AdminPanel from './pages/AdminPanel';
import { Navbar } from './components/UI';

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/' && location.pathname !== '/admin';

  return (
    <div className="max-w-md mx-auto min-h-screen relative bg-transparent">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/songs" element={<Home />} />
        <Route path="/song/:id" element={<SongDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/categories" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNavbar && <Navbar />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
