// src/pages/LoginPage.jsx
import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLoginThunk, loginThunk, resendVerificationThunk } from '../redux/slices/authSlice';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import { useState } from 'react';

const LoginPage = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [adminMode, setAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleCredential = useCallback(async (response) => {
    const result = await dispatch(loginThunk({ credential: response.credential }));
    if (loginThunk.fulfilled.match(result)) {
      onClose?.();
      navigate(result.payload.user?.role === 'admin' ? '/admin' : '/');
    }
  }, [dispatch, navigate, onClose]);

  const handleResend = async () => {
    if (verificationEmail) await dispatch(resendVerificationThunk(verificationEmail));
  };

  const handleAdminSubmit = async (event) => {
    event.preventDefault();
    const result = await dispatch(adminLoginThunk({ email: adminEmail, password: adminPassword }));
    if (adminLoginThunk.fulfilled.match(result)) {
      onClose?.();
      navigate('/admin');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 animate-fade-in">
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
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-extrabold text-white">Welcome Back</h1>
            <p className="text-sm text-on-surface-variant">Sign in securely with your Google account</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {adminMode ? (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <input aria-label="Admin email" type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} required placeholder="Admin email" className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none" />
              <input aria-label="Admin password" type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} required placeholder="Admin password" className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none" />
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-black disabled:opacity-60">{loading ? 'Signing in...' : 'Admin sign in'}</button>
            </form>
          ) : <GoogleSignInButton onCredential={handleCredential} />}

          {error?.includes('verify') && (
            <div className="mt-5 space-y-3">
              <input
                aria-label="Verification email"
                type="email"
                value={verificationEmail}
                onChange={(event) => setVerificationEmail(event.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none"
              />
              <button type="button" onClick={handleResend} disabled={loading || !verificationEmail} className="w-full text-sm font-semibold text-primary disabled:opacity-60">
                {loading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          )}

          <button type="button" onClick={() => setAdminMode((value) => !value)} className="mt-6 w-full text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary">
            {adminMode ? 'Use Google sign-in' : 'Admin sign-in'}
          </button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-grow bg-white/10" />
            <span className="text-xs uppercase text-on-surface-variant">Or continue with</span>
            <div className="h-[1px] flex-grow bg-white/10" />
          </div>

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
