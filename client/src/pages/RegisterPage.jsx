// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * RegisterPage Component
 * 
 * Displays a registration form for new users.
 * 
 * Features:
 * - Full name, email, phone, password, confirm password fields
 * - Password show/hide toggles
 * - Terms and conditions checkbox
 * - Submit button "Create Account"
 * - Social signup placeholders (desktop)
 * - Link to Login page
 * - Ambient background glows
 * - Responsive layout
 */
const RegisterPage = () => {
  const navigate = useNavigate();

  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Account created successfully!');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-x-hidden animate-fade-in">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Minimal header (logo only) - suppresses full nav for focused flow */}
      <header className="relative z-10 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-center md:justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="font-heading text-2xl font-bold text-primary">
            Ahadu Center
          </Link>
          {/* Desktop nav links (optional, hidden on mobile) */}
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

          {/* Registration card */}
          <div className="glass-panel rounded-xl p-6 md:p-8 relative overflow-hidden">
            {/* Card top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-on-surface-variant text-sm">
                Join Ahadu Center to explore movies, electronics, and books
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    person
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone (optional) */}
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Phone Number <span className="normal-case text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    call
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    lock
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">
                    lock_reset
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#0B0F19] border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 bg-[#0B0F19] border-white/10 rounded text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-on-surface-variant">
                  I agree to the{' '}
                  <a href="#" className="text-secondary hover:text-secondary-fixed transition-colors underline">Terms and Conditions</a>{' '}
                  and{' '}
                  <a href="#" className="text-secondary hover:text-secondary-fixed transition-colors underline">Privacy Policy</a>.
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-grow h-[1px] bg-white/10" />
              <span className="text-xs uppercase text-on-surface-variant">Or register with</span>
              <div className="flex-grow h-[1px] bg-white/10" />
            </div>

            {/* Social buttons (desktop only) */}
            <div className="hidden md:grid grid-cols-3 gap-3">
              <button className="flex justify-center items-center py-3 border border-white/10 rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-white">login</span>
              </button>
              <button className="flex justify-center items-center py-3 border border-white/10 rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-white">public</span>
              </button>
              <button className="flex justify-center items-center py-3 border border-white/10 rounded-lg hover:border-secondary transition-all">
                <span className="material-symbols-outlined text-white">devices</span>
              </button>
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-on-surface-variant mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:text-secondary-fixed font-semibold transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="relative z-10 bg-surface-container-lowest border-t border-white/5 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4">
          <div className="text-lg font-bold text-primary">Ahadu Center</div>
          <div className="text-sm text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</div>
          <div className="flex gap-4 text-sm text-on-surface-variant">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-secondary transition-colors">Help Center</a>
            <a href="#" className="hover:text-secondary transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-surface-container border border-primary/50 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;