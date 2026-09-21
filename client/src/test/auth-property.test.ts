import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, {
  adminLoginThunk,
  loginThunk,
  registerThunk,
  resendVerificationThunk,
  verifyEmailThunk,
  logoutAction,
} from '../redux/slices/authSlice';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    loginWithGoogle: vi.fn(),
    adminLogin: vi.fn(),
    register: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
  },
}));

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: true,
};

describe('Auth slice passwordless and admin flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in regular users with a Google credential and persists the token', async () => {
    const user = { id: 'user-1', name: 'Member', email: 'member@example.com', role: 'user' };
    authService.loginWithGoogle.mockResolvedValue({ token: 'google-token', user });

    const action = await loginThunk({ credential: 'google-credential' })(vi.fn(), () => ({}), undefined);
    const state = authReducer(initialState, action);

    expect(authService.loginWithGoogle).toHaveBeenCalledWith('google-credential');
    expect(state).toMatchObject({ token: 'google-token', user, loading: false });
    expect(localStorage.getItem('token')).toBe('google-token');
  });

  it('registers without persisting a token or creating a session', async () => {
    const response = { verificationRequired: true, user: { name: 'Member', email: 'member@example.com' } };
    authService.register.mockResolvedValue(response);

    const action = await registerThunk({ name: 'Member', email: 'member@example.com' })(vi.fn(), () => ({}), undefined);
    const state = authReducer(initialState, action);

    expect(authService.register).toHaveBeenCalledWith('Member', 'member@example.com');
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('supports admin password login separately', async () => {
    const user = { id: 'admin-1', name: 'Admin', email: 'admin@example.com', role: 'admin' };
    authService.adminLogin.mockResolvedValue({ token: 'admin-token', user });

    const action = await adminLoginThunk({ email: user.email, password: 'secret' })(vi.fn(), () => ({}), undefined);
    const state = authReducer(initialState, action);

    expect(authService.adminLogin).toHaveBeenCalledWith(user.email, 'secret');
    expect(state.user.role).toBe('admin');
    expect(localStorage.getItem('token')).toBe('admin-token');
  });

  it('handles verification and resend thunks', async () => {
    authService.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' });
    authService.resendVerification.mockResolvedValue({ message: 'Email sent' });

    const verified = await verifyEmailThunk('verification-token')(vi.fn(), () => ({}), undefined);
    const resent = await resendVerificationThunk('member@example.com')(vi.fn(), () => ({}), undefined);

    expect(verified.type).toBe('auth/verifyEmail/fulfilled');
    expect(resent.type).toBe('auth/resendVerification/fulfilled');
    expect(authService.verifyEmail).toHaveBeenCalledWith('verification-token');
    expect(authService.resendVerification).toHaveBeenCalledWith('member@example.com');
  });

  it('clears the session on logout', () => {
    localStorage.setItem('token', 'token');
    const state = authReducer({ ...initialState, user: { id: '1' }, token: 'token', error: 'error' }, logoutAction());

    expect(state).toMatchObject({ user: null, token: null, error: null });
    expect(localStorage.getItem('token')).toBeNull();
  });
});
