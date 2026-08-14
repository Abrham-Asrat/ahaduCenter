// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * LoginPage Component
 * 
 * Displays a login form with glassmorphism styling.
 * 
 * Features:
 * - Email/Username input with person icon
 * - Password input with lock icon and show/hide toggle
 * - Remember me checkbox (custom styled)
 * - "Forgot Password?" link
 * - Submit button (Sign In) with glow effect
 * - Link to Register page
 * - Atmospheric background glows
 * - Responsive: centered card, full width on mobile
 */
const LoginPage = () => {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, call API to authenticate
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-x-hidden">
      {/* Atmospheric background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Simplified Navbar */}
      <nav className="relative z-10 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="font-heading text-2xl font-bold text-primary">
            Ahadu Center
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/movies" className="text-on-surface-variant hover:text-primary transition-colors">Movies</Link>
            <Link to="/electronics" className="text-on-surface-variant hover:text-primary transition-colors">Electronics</Link>
            <Link to="/books" className="text-on-surface-variant hover:text-primary transition-colors">Books</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-primary font-semibold hover:text-primary-fixed transition-colors">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        {/* Login card */}
        <div className="glass-panel rounded-xl w-full max-w-md p-6 md:p-8 glow-emerald transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant">Sign in to your Ahadu Center account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Email or Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none material-symbols-outlined text-on-surface-variant">
                  person
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-xs uppercase tracking-wider text-on-surface-variant">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-secondary hover:text-secondary-fixed transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none material-symbols-outlined text-on-surface-variant">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 bg-[#0B0F19] border-white/10 rounded text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-on-surface-variant cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-fixed transition-colors font-semibold">
                Request Access
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="relative z-10 bg-surface-container-lowest border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="text-lg font-bold text-primary">Ahadu Center</div>
          <div className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</div>
          <div className="flex gap-4 text-sm text-on-surface-variant">
            <Link to="/contact" className="hover:text-secondary transition-colors">Help</Link>
            <Link to="/contact" className="hover:text-secondary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;