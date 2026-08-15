// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage Component
 * 
 * Displays a 404 error page when a route doesn't exist.
 * 
 * Features:
 * - Large 404 display with gradient/glow effect
 * - Page not found title and description
 * - Search bar (non-functional placeholder)
 * - Navigation buttons: Back to Home, Browse Movies, Shop Electronics, Explore Books
 * - Helpful links: Contact Support, FAQ, Site Map
 * - Simplified footer
 * 
 * Self-contained (no full Navbar) for a dead-end page.
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Glass card */}
        <div className="glass-panel rounded-xl p-8 max-w-3xl w-full text-center relative z-10">
          {/* 404 number */}
          <h1
            className="text-8xl md:text-9xl font-bold leading-none bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-4"
            style={{ textShadow: '0 0 40px rgba(16,185,129,0.3)' }}
          >
            404
          </h1>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
            Oops! The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-8 relative">
            <input
              type="text"
              placeholder="Search movies, electronics, books..."
              className="w-full bg-background border border-white/10 rounded-full py-3 pl-4 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              search
            </span>
          </div>

          {/* Navigation buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
            <Link
              to="/"
              className="bg-primary text-black px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
            >
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </Link>
            <Link
              to="/movies"
              className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
            >
              <span className="material-symbols-outlined">movie</span>
              Browse Movies
            </Link>
            <Link
              to="/electronics"
              className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
            >
              <span className="material-symbols-outlined">devices</span>
              Shop Electronics
            </Link>
            <Link
              to="/books"
              className="border border-white/20 text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-secondary hover:text-secondary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
            >
              <span className="material-symbols-outlined">menu_book</span>
              Explore Books
            </Link>
          </div>

          {/* Helpful links */}
          <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-white/5">
            <a href="/contact" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">support_agent</span>
              Contact Support
            </a>
            <a href="/contact" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">help</span>
              FAQ
            </a>
            <a href="/contact" className="text-secondary text-sm flex items-center gap-1 hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-sm">map</span>
              Site Map
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 max-w-7xl mx-auto gap-4">
          <div>
            <p className="text-primary font-semibold">Ahadu Center</p>
            <p className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-secondary transition-colors">Customer Support</a>
            <a href="#" className="hover:text-secondary transition-colors">About Us</a>
            <a href="#" className="hover:text-secondary transition-colors">Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;