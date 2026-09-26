// src/pages/LoginPage.jsx
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginThunk, resendVerificationThunk } from '../redux/slices/authSlice';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import type { RootState } from '../redux/store';

type LoginPageProps = {
  onClose?: () => void;
};

const ADMIN_EMAILS = new Set(['admin@ahadu.test', 'admin@ahaducenter.com']);

const LoginPage = ({ onClose }: LoginPageProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const [verificationEmail, setVerificationEmail] = useState('');

  const handleCredential = useCallback(async (response: GoogleCredentialResponse) => {
    const result = await dispatch(loginThunk({ credential: response.credential }));
    if (loginThunk.fulfilled.match(result)) {
      onClose?.();
      navigate(result.payload.user?.role === 'admin' ? '/admin' : '/');
    }
  }, [dispatch, navigate, onClose]);


  const handleManualLogin = async () => {
    const email = verificationEmail.trim();
    if (!email) return;

    const result = await dispatch(loginThunk({ credential: email }));
    if (loginThunk.fulfilled.match(result)) {
      const user = result.payload.user;
      const isAdmin = user?.role === 'admin' || ADMIN_EMAILS.has((user?.email ?? email).toLowerCase());

      onClose?.();
      navigate(isAdmin ? '/admin' : '/');
    }
  };

  const handleResend = async () => {
    if (verificationEmail) await dispatch(resendVerificationThunk(verificationEmail));
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
          className="absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-surface-container text-on-surface-variant transition hover:border-primary hover:text-primary"
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

          <div className="mb-5">
            <label htmlFor="login-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Registered Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={verificationEmail}
              onChange={(event) => setVerificationEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={loading || !verificationEmail}
              className="mt-2 text-xs font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending verification email...' : 'Resend verification email'}
            </button>
          </div>

          <div className="mb-4 space-y-3">
            <button
              type="button"
              onClick={handleManualLogin}
              className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Login
            </button>
            <GoogleSignInButton onCredential={handleCredential} />
          </div>

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
