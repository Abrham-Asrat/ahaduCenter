// src/pages/NotFoundPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col animate-fade-in">
      <main className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="glass-panel rounded-xl p-8 max-w-3xl w-full text-center relative z-10">
          <h1
            className="text-8xl md:text-9xl font-bold leading-none bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-4"
            style={{ textShadow: '0 0 40px rgba(16,185,129,0.3)' }}
          >
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Page Not Found</h2>

          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Functional search bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, electronics, books..."
              className="w-full bg-background border border-white/10 rounded-full py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
          </form>

          {/* Navigation buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <Link to="/" className="bg-primary text-black px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
            <Link to="/movies" className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary transition-all">
              <span className="material-symbols-outlined">movie</span>
              Browse Movies
            </Link>
            <Link to="/electronics" className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary transition-all">
              <span className="material-symbols-outlined">devices</span>
              Shop Electronics
            </Link>
            <Link to="/books" className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary transition-all">
              <span className="material-symbols-outlined">menu_book</span>
              Explore Books
            </Link>
          </div>

          {/* Helpful links */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/5">
            <Link to="/contact" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Contact Support
            </Link>
            <Link to="/contact" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">help</span>
              FAQ
            </Link>
            <Link to="/" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">map</span>
              Site Map
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-surface-container-lowest border-t border-white/5 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 max-w-7xl mx-auto gap-4">
          <div>
            <p className="text-primary font-semibold">Ahadu Center</p>
            <p className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            <Link to="/contact" className="hover:text-secondary transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors">Customer Support</Link>
            <Link to="/" className="hover:text-secondary transition-colors">About Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
