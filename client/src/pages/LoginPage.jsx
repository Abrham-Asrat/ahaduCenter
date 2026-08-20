// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      // Navigate based on role returned in the payload
      const role = result.payload?.user?.role;
      navigate(role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col relative overflow-x-hidden animate-fade-in">
      {/* Atmospheric background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Simplified Navbar */}
      <nav className="relative z-10 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="font-heading text-2xl font-extrabold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">storefront</span>
            Ahadu Center
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/movies" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">Movies</Link>
            <Link to="/electronics" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">Electronics</Link>
            <Link to="/books" className="text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold">Books</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-primary font-bold hover:text-primary-fixed transition-colors text-sm">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative z-10">
        {/* Login card */}
        <div className="glass-panel rounded-2xl w-full max-w-md p-6 md:p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant text-sm">Sign in to access your Ahadu Center portal</p>
          </div>

          {/* Error message from Redux */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 flex items-center gap-2 text-sm font-medium">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2 font-bold">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none material-symbols-outlined text-on-surface-variant">
                  mail
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-secondary hover:underline font-semibold">
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
                  className="w-full bg-[#0B0F19] border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
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
                className="h-4 w-4 bg-[#0B0F19] border-white/10 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs text-on-surface-variant cursor-pointer font-medium">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-extrabold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all cursor-pointer uppercase text-xs tracking-wider disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-bold">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Simplified footer */}
      <footer className="relative z-10 bg-surface-container-lowest border-t border-white/10 py-6">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center">
          <div className="text-lg font-bold text-primary">Ahadu Center Hub</div>
          <div className="text-xs text-on-surface-variant">© 2024 Ahadu Center. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
