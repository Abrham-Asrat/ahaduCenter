// src/components/common/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * Navbar Component
 * 
 * Features:
 * - Dynamic auth state (hides Sign In/Sign Up when logged in)
 * - Shows Cart & Wishlist icons when logged in
 * - Circular User Avatar button with profile dropdown
 * - Interactive Dark Mode / Light Mode toggler inside profile menu
 * - Edit Profile navigation, order history, and Sign Out handler
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Auth state - check localStorage or default to true for previewing logged-in user UI
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('ahadu_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('ahadu_user_email') || 'alex.mercer@ahaducenter.com';
  });

  // Profile menu dropdown toggle
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Theme state: dark vs light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = localStorage.getItem('ahadu_theme');
    return theme ? theme === 'dark' : true;
  });

  // Mobile menu drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthChange = () => {
      const saved = localStorage.getItem('ahadu_logged_in');
      setIsLoggedIn(saved !== null ? saved === 'true' : true);
      setUserEmail(localStorage.getItem('ahadu_user_email') || 'alex.mercer@ahaducenter.com');
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // Sync theme with HTML root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ahadu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ahadu_theme', 'light');
    }
  }, [isDarkMode]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    localStorage.setItem('ahadu_logged_in', 'false');
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface-container/80 backdrop-blur-xl border-b border-white/10 shadow-xl transition-colors">
      <div className="flex justify-between items-center px-4 md:px-8 py-3 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <Link to="/" className="font-heading text-2xl font-black text-primary flex items-center gap-2 tracking-wide">
          <div className="w-9 h-9 rounded-xl bg-primary text-black flex items-center justify-center font-black shadow-lg">
            <span className="material-symbols-outlined text-black text-xl">storefront</span>
          </div>
          <span className="text-white">Ahadu<span className="text-primary">Center</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link
            to="/movies"
            className={`text-sm font-bold tracking-wide uppercase transition-all pb-1 ${isActive('/movies')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
              }`}
          >
            Movies
          </Link>
          <Link
            to="/electronics"
            className={`text-sm font-bold tracking-wide uppercase transition-all pb-1 ${isActive('/electronics')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
              }`}
          >
            Electronics
          </Link>
          <Link
            to="/books"
            className={`text-sm font-bold tracking-wide uppercase transition-all pb-1 ${isActive('/books')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
              }`}
          >
            Books
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-bold tracking-wide uppercase transition-all pb-1 ${isActive('/contact')
                ? 'text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-primary'
              }`}
          >
            About / Contact Us
          </Link>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-4">
          {/* Search Trigger */}
          <Link to="/search" className="text-on-surface-variant hover:text-primary transition-colors p-2 cursor-pointer">
            <span className="material-symbols-outlined text-2xl">search</span>
          </Link>

          {isLoggedIn ? (
            /* Logged-In User Actions: Wishlist, Cart, Circular Profile Avatar */
            <div className="flex items-center gap-3">
              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="text-on-surface-variant hover:text-error transition-colors p-2 relative cursor-pointer"
                title="View Wishlist"
              >
                <span className="material-symbols-outlined text-2xl">favorite</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-pulse" />
              </Link>

              {/* Cart Link with Badge */}
              <Link
                to="/cart"
                className="text-on-surface-variant hover:text-primary transition-colors p-2 relative cursor-pointer"
                title="View Pick-Up Cart"
              >
                <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                <span className="absolute -top-1 -right-1 bg-primary text-black font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  2
                </span>
              </Link>

              {/* Circular User Profile Avatar Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border-2 border-primary/50 hover:border-primary transition-all cursor-pointer focus:outline-none bg-surface-container-high"
                  title="User Profile Menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-surface-container-high border border-white/20 flex items-center justify-center font-black text-white text-sm relative">
                    <span>AM</span>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
                  </div>
                </button>

                {/* User Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl p-4 border border-white/10 shadow-2xl z-50 animate-fadeIn">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-white/10 mb-3">
                      <div className="w-11 h-11 rounded-full bg-primary text-black font-black flex items-center justify-center text-base shadow-lg">
                        AM
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-white font-extrabold text-sm truncate">Alex Mercer</h4>
                        <p className="text-xs text-on-surface-variant truncate">{userEmail}</p>
                        <span className="inline-block mt-1 bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          Verified Member
                        </span>
                      </div>
                    </div>

                    {/* Dark Mode / Light Mode Toggler */}
                    <div className="bg-background/60 p-3 rounded-xl border border-white/10 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-xl">
                          {isDarkMode ? 'dark_mode' : 'light_mode'}
                        </span>
                        <span className="text-xs text-white font-bold">
                          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                        </span>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center cursor-pointer ${isDarkMode ? 'bg-primary justify-end' : 'bg-surface-variant justify-start'
                          }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-black shadow-md block" />
                      </button>
                    </div>

                    {/* Menu Navigation Links */}
                    <div className="space-y-1 text-xs font-bold uppercase tracking-wider">
                      <Link
                        to="/account"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-primary">person</span>
                        Edit Profile / Account
                      </Link>

                      <Link
                        to="/purchase-history"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-secondary">confirmation_number</span>
                        My Pick-Up Passes
                      </Link>

                      <Link
                        to="/borrowing-history"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-purple-400">auto_stories</span>
                        Book Borrowing History
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-error">favorite</span>
                        Saved Wishlist
                      </Link>

                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg text-tertiary">admin_panel_settings</span>
                        Admin Terminal
                      </Link>
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-3 mt-3 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-error bg-error/10 hover:bg-error/20 transition-all font-bold text-xs uppercase cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged-Out Actions: Sign In & Sign Up Buttons */
            <div className="hidden md:flex gap-3">
              <Link to="/login">
                <button className="px-4 py-2 border border-white/20 rounded-xl text-xs uppercase font-extrabold text-white hover:bg-white/10 transition-all cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 bg-primary text-black rounded-xl text-xs uppercase font-extrabold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary p-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-4 space-y-4">
          <div className="flex flex-col gap-3">

            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold uppercase text-white py-1 border-b border-white/5"
            >
              About / Contact Us
            </Link>
          </div>

          {!isLoggedIn && (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-2.5 border border-white/20 rounded-xl text-xs uppercase font-bold text-white">
                  Sign In
                </button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full py-2.5 bg-primary text-black rounded-xl text-xs uppercase font-extrabold">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>

      {/* Bottom Navigation (Mobile Specific) */}
      <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest border-t border-white/5 md:hidden">
        <div className="flex justify-around items-center py-2">
          <Link to="/" className={`flex flex-col items-center transition-colors ${isActive('/') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/') ? "'FILL' 1" : "'FILL' 0" }}>home</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Home</span>
          </Link>
          <Link to="/movies" className={`flex flex-col items-center transition-colors ${isActive('/movies') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/movies') ? "'FILL' 1" : "'FILL' 0" }}>movie</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Movies</span>
          </Link>
          <Link to="/electronics" className={`flex flex-col items-center transition-colors ${isActive('/electronics') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/electronics') ? "'FILL' 1" : "'FILL' 0" }}>devices</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Tech</span>
          </Link>
          <Link to="/books" className={`flex flex-col items-center transition-colors ${isActive('/books') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive('/books') ? "'FILL' 1" : "'FILL' 0" }}>menu_book</span>
            <span className="text-[10px] uppercase tracking-wider font-semibold mt-1">Books</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;