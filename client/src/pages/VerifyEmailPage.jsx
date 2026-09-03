import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resendVerificationThunk, verifyEmailThunk } from '../redux/slices/authSlice';

const VerifyEmailPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState(token ? 'verifying' : 'ready');
  const [message, setMessage] = useState('');
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return undefined;

    let active = true;
    dispatch(verifyEmailThunk(token)).then((result) => {
      if (!active) return;
      if (verifyEmailThunk.fulfilled.match(result)) {
        setStatus('success');
        setMessage('Your email has been verified. You can now sign in with Google.');
      } else {
        setStatus('error');
        setMessage(result.payload || 'This verification link is invalid or has expired.');
      }
    });

    return () => { active = false; };
  }, [dispatch, token]);

  const handleResend = async (event) => {
    event.preventDefault();
    const result = await dispatch(resendVerificationThunk(email));
    if (resendVerificationThunk.fulfilled.match(result)) {
      setMessage('If an account requires verification, a new email has been sent.');
    } else {
      setMessage(result.payload || 'Unable to resend the verification email.');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
        <span className="material-symbols-outlined mb-4 text-5xl text-primary">
          {status === 'success' ? 'verified' : status === 'error' ? 'error' : 'mail'}
        </span>
        <h1 className="mb-3 text-2xl font-bold text-white">
          {status === 'verifying' ? 'Verifying your email' : status === 'success' ? 'Email verified' : 'Check your email'}
        </h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          {message || (status === 'verifying' ? 'Please wait while we confirm your email address.' : 'Open the verification link we sent to finish creating your account.')}
        </p>

        {status === 'success' ? (
          <Link to="/login" className="block rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-black">Continue to Google sign-in</Link>
        ) : (
          <form onSubmit={handleResend} className="space-y-3 text-left">
            <label htmlFor="verification-email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email address</label>
            <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none" />
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-black disabled:opacity-60">
              {loading ? 'Sending...' : 'Resend verification email'}
            </button>
          </form>
        )}
        <Link to="/login" className="mt-5 block text-sm font-semibold text-primary hover:underline">Back to sign in</Link>
      </section>
    </main>
  );
};

export default VerifyEmailPage;