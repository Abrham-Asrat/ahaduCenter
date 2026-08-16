// src/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ForgotPasswordPage Component
 * 
 * Displays a form for users to request a password reset link.
 * 
 * Features:
 * - Email input with mail icon and focus glow
 * - Submit button "Send Reset Link"
 * - Success state with check icon after submission
 * - Back to Login link
 * - Ambient background glows
 * - Responsive layout (card full width on mobile, centered on desktop)
 */
const ForgotPasswordPage = () => {
  // State for email input
  const [email, setEmail] = useState('');
  // State for submission status
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, call API to send reset email
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-x-hidden animate-fade-in">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      {/* Simplified header */}
      <header className="relative z-10 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-center md:justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="font-heading text-2xl font-bold text-primary">
            Ahadu Center
          </Link>
          {/* Desktop nav links hidden for transactional focus */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/movies" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Movies</Link>
            <Link to="/electronics" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Electronics</Link>
            <Link to="/books" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Books</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Login</Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile brand logo (hidden on desktop) */}
          <div className="md:hidden text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Ahadu Center</h1>
          </div>

          {/* Forgot Password Card */}
          <div className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden">
            {/* Card top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {!submitted ? (
              <>
                {/* Form state */}
                <div className="text-center mb-8">
                  {/* Lock icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container border border-white/5 mb-4 relative">
                    <span className="material-symbols-outlined text-[32px] text-primary">lock_reset</span>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
                  <p className="text-on-surface-variant text-sm">
                    Enter the email address associated with your account, and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email input */}
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                        mail
                      </span>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    Send Reset Link
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary-fixed transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-4">
                    <span className="material-symbols-outlined text-[32px] text-primary">check_circle</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
                  <p className="text-on-surface-variant text-sm mb-6">
                    We've sent a password reset link to <span className="text-white font-semibold">{email}</span>.
                    The link will expire in 30 minutes.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                  >
                    Return to Login
                  </Link>
                  <p className="text-on-surface-variant text-sm mt-4">
                    Didn't receive the email?{' '}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-secondary hover:text-secondary-fixed transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="relative z-10 bg-surface-container-lowest border-t border-white/5 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4">
          <div className="text-lg font-bold text-primary">Ahadu Center</div>
          <div className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</div>
          <div className="flex gap-4 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-secondary transition-colors">About Us</a>
            <a href="#" className="hover:text-secondary transition-colors">Support</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;