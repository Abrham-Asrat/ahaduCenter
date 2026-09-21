import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';
import API from '../services/api';
import { store } from '../redux/store';

vi.mock('../redux/store', () => ({
  store: {
    dispatch: vi.fn(),
  },
}));

describe('API Interceptor Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // Property 1: auth request interceptor attaches Bearer token
  it('Property 1: request interceptor attaches Bearer token when token is present', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (token) => {
        localStorage.setItem('token', token);

        const requestInterceptor = API.interceptors.request.handlers[0].fulfilled;
        const dummyConfig = { headers: {} };
        const resultConfig = await requestInterceptor(dummyConfig);

        expect(resultConfig.headers.Authorization).toBe(`Bearer ${token}`);
      }),
      { numRuns: 10 }
    );
  });

  // Property 13: response interceptor extracts error string
  it('Property 13: response interceptor extracts error string from payload', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 400, max: 599 }).filter((s) => s !== 401),
        fc.string({ minLength: 1 }),
        async (status, errorMsg) => {
          const responseInterceptorErr = API.interceptors.response.handlers[0].rejected;

          const errorPayload = {
            response: {
              status,
              data: { error: errorMsg },
            },
          };

          try {
            await responseInterceptorErr(errorPayload);
            expect.unreachable('Should have rejected');
          } catch (err) {
            expect(err).toBe(errorMsg);
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  // Property 14: 401 response triggers logout and state reset
  it('Property 14: 401 response triggers logout action', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (token) => {
        localStorage.setItem('token', token);

        // Mock window.location
        const originalLocation = window.location;
        delete window.location;
        window.location = { href: '' };

        const responseInterceptorErr = API.interceptors.response.handlers[0].rejected;
        const errorPayload = {
          response: {
            status: 401,
            data: { error: 'Unauthorized' },
          },
        };

        try {
          await responseInterceptorErr(errorPayload);
        } catch (err) {
          expect(err).toBe('Session expired. Please log in again.');
        }

        expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'auth/logoutAction' }));
        expect(window.location.href).toBe('/login');

        window.location = originalLocation;
      }),
      { numRuns: 10 }
    );
  });
});
