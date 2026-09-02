// src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, clearAuthError } from '../redux/slices/authSlice';

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
const RegisterPage = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((s) => s.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState(null);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate('/');
  };

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (onClose) {
        onClose();
      }
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    const result = await dispatch(registerThunk({
      name: fullName || email.split('@')[0],
      email,
      password: ''
    }));

    if (registerThunk.fulfilled.match(result)) {
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
      setTimeout(() => {
        const role = result.payload?.role ?? result.payload?.user?.role;
        navigate(role === 'admin' ? '/admin' : '/');
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8">
      <div className="relative w-full max-w-md">
        <button
          type="button"
          onClick={handleClose}
          className="absolute -top-3 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container text-on-surface-variant transition hover:border-primary hover:text-primary"
          aria-label="Close sign up"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="glass-panel relative overflow-hidden rounded-xl p-6 md:p-8">
          <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">Create Account</h2>
            <p className="text-sm text-on-surface-variant">Join Ahadu Center to explore movies, electronics, and books</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-on-surface-variant">
                  person
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-3 pl-10 pr-4 text-sm font-medium text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0B0F19] py-3 pl-10 pr-4 text-sm font-medium text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {(validationError || error) && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-[18px] text-red-400">error</span>
                <p className="text-sm text-red-400">{validationError || error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              )}
              {loading ? 'Sending Link...' : 'Send Magic Link'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] flex-grow bg-white/10" />
            <span className="text-xs uppercase text-on-surface-variant">Or continue with</span>
            <div className="h-[1px] flex-grow bg-white/10" />
          </div>

          <button
            type="button"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-3 font-semibold text-white transition hover:bg-white/10 hover:border-primary flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔍</span>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-secondary transition-colors hover:text-secondary-fixed">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;