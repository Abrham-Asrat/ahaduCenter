import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import authReducer, {
  loginThunk,
  registerThunk,
  logoutAction,
} from '../redux/slices/authSlice';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('Auth Slice Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Property 2: loginThunk sets token and user in Redux state
  it('Property 2: loginThunk sets token and user in Redux state', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 10 }),
        fc.record({
          id: fc.string(),
          name: fc.string(),
          email: fc.emailAddress(),
        }),
        async (email, password, token, user) => {
          authService.login.mockResolvedValueOnce({ token, user });

          const initialState = { user: null, token: null, loading: false, error: null, initialized: true };
          const action = await loginThunk({ email, password })(vi.fn(), () => ({ auth: initialState }), undefined);

          const newState = authReducer(initialState, action);

          expect(newState.token).toBe(token);
          expect(newState.user).toEqual(user);
          expect(newState.loading).toBe(false);
        }
      )
    );
  });

  // Property 3: loginThunk persists token to localStorage
  it('Property 3: loginThunk persists token to localStorage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 10 }),
        fc.record({ id: fc.string(), name: fc.string() }),
        async (email, password, token, user) => {
          authService.login.mockResolvedValueOnce({ token, user });

          await loginThunk({ email, password })(vi.fn(), () => ({}), undefined);

          expect(localStorage.getItem('token')).toBe(token);
        }
      )
    );
  });

  // Property 4: registerThunk sets token and user
  it('Property 4: registerThunk sets token and user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.emailAddress(),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 10 }),
        fc.record({ id: fc.string(), name: fc.string() }),
        async (name, email, password, token, user) => {
          authService.register.mockResolvedValueOnce({ token, user });

          const initialState = { user: null, token: null, loading: false, error: null, initialized: true };
          const action = await registerThunk({ name, email, password })(vi.fn(), () => ({ auth: initialState }), undefined);

          const newState = authReducer(initialState, action);

          expect(newState.token).toBe(token);
          expect(newState.user).toEqual(user);
          expect(newState.loading).toBe(false);
          expect(localStorage.getItem('token')).toBe(token);
        }
      )
    );
  });

  // Property 5: logoutAction clears all auth state
  it('Property 5: logoutAction clears all auth state', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10 }),
        fc.record({ id: fc.string(), name: fc.string() }),
        (token, user) => {
          localStorage.setItem('token', token);
          const stateWithAuth = { user, token, loading: false, error: 'some error', initialized: true };

          const newState = authReducer(stateWithAuth, logoutAction());

          expect(newState.user).toBeNull();
          expect(newState.token).toBeNull();
          expect(newState.error).toBeNull();
          expect(localStorage.getItem('token')).toBeNull();
        }
      )
    );
  });

  // Property 6: failed auth thunk sets auth.error to the rejection string
  it('Property 6: failed auth thunk sets auth.error to the rejection string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        async (email, password, errorMessage) => {
          authService.login.mockRejectedValueOnce(errorMessage);

          const initialState = { user: null, token: null, loading: false, error: null, initialized: true };
          const action = await loginThunk({ email, password })(vi.fn(), () => ({ auth: initialState }), undefined);

          const newState = authReducer(initialState, action);

          expect(newState.error).toBe(errorMessage);
          expect(newState.loading).toBe(false);
        }
      )
    );
  });
});
