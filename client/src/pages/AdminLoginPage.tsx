import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { adminLoginThunk } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';

const AdminLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(adminLoginThunk({ email, password }));

    if (adminLoginThunk.fulfilled.match(result)) {
      navigate('/admin');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B14] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-6 shadow-2xl md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">Admin access</p>
          <h1 className="text-3xl font-extrabold text-white">Admin Login</h1>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Admin email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@ahadu.test"
              required
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
              className="w-full rounded-xl border border-white/10 bg-[#0B0F19] px-4 py-3 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold uppercase tracking-wider text-black disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs font-semibold text-primary hover:underline">
            Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
