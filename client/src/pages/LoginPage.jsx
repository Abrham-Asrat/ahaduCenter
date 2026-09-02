// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../redux/slices/authSlice';

const LoginPage = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      const role = result.payload?.role ?? result.payload?.user?.role;
      if (onClose) {
        onClose();
      }
      navigate(role === 'admin' ? '/admin' : '/');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-3 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container text-on-surface-variant transition hover:border-primary hover:text-primary"
          aria-label="Close sign in"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="glass-panel rounded-2xl border border-white/10 p-6 shadow-2xl md:p-8">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-sm text-on-surface-variant">Sign in to access your Ahadu Center portal</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                  mail
                </span>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-3 pl-10 pr-4 text-sm font-medium text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-secondary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-3 pl-10 pr-12 text-sm font-medium text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-on-surface-variant transition hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-white/10 bg-[#0B0F19] text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 cursor-pointer text-xs font-medium text-on-surface-variant">
                Remember me for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              )}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
