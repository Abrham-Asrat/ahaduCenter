import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resendVerificationThunk, verifyEmailThunk } from '../redux/slices/authSlice';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [status, setStatus] = useState(token ? 'verifying' : 'ready');
  const [message, setMessage] = useState('');
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return undefined;

    let active = true;
    dispatch(verifyEmailThunk(token)).then((result) => {
      if (!active) return;
      if (verifyEmailThunk.fulfilled.match(result)) {
        setStatus('success');
        setMessage(t('auth.verifyEmailPage.messageSuccess'));
      } else {
        setStatus('error');
        setMessage(typeof result.payload === 'string' ? result.payload : t('auth.verifyEmailPage.messageInvalid'));
      }
    });

    return () => { active = false; };
  }, [dispatch, token, t]);

  const handleResend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(resendVerificationThunk(email));
    if (resendVerificationThunk.fulfilled.match(result)) {
      setMessage(t('auth.verifyEmailPage.messageResent'));
    } else {
      setMessage(typeof result.payload === 'string' ? result.payload : t('auth.verifyEmailPage.messageResendFailed'));
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <section className="glass-panel w-full max-w-md rounded-2xl border border-white/10 p-8 text-center shadow-2xl">
        <span className="material-symbols-outlined mb-4 text-5xl text-primary">
          {status === 'success' ? 'verified' : status === 'error' ? 'error' : 'mail'}
        </span>
        <h1 className="mb-3 text-2xl font-bold text-white">
          {status === 'verifying' ? t('auth.verifyEmailPage.titleVerifying') : status === 'success' ? t('auth.verifyEmailPage.titleSuccess') : t('auth.verifyEmailPage.titleReady')}
        </h1>
        <p className="mb-6 text-sm text-on-surface-variant">
          {message || (status === 'verifying' ? t('auth.verifyEmailPage.messageVerifying') : t('auth.verifyEmailPage.messageReady'))}
        </p>

        {status === 'success' ? (
          <Link to="/login" className="block rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-black">{t('auth.verifyEmailPage.continueButton')}</Link>
        ) : (
          <form onSubmit={handleResend} className="space-y-3 text-left">
            <label htmlFor="verification-email" className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('auth.verifyEmailPage.emailLabel')}</label>
            <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none" />
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wider text-black disabled:opacity-60">
              {loading ? t('auth.verifyEmailPage.sending') : t('auth.verifyEmailPage.resendButton')}
            </button>
          </form>
        )}
        <Link to="/login" className="mt-5 block text-sm font-semibold text-primary hover:underline">{t('auth.verifyEmailPage.backToSignIn')}</Link>
      </section>
    </main>
  );
};

export default VerifyEmailPage;