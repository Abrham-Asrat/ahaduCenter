// API operations for registration, login, verification, and password recovery.
import API from './api';

export const authService = {
  // POST /api/auth/google  { credential }
  loginWithGoogle: (credential: string) =>
    API.post('/auth/google', { credential }).then((r) => r.data),

  registerWithGoogle: (credential: string) =>
    API.post('/auth/google/register', { credential }).then((r) => r.data),

  // POST /api/auth/admin-login  { email, password }
  adminLogin: (email: string, password: string) =>
    API.post('/auth/admin-login', { email, password }).then((r) => r.data),

  // POST /api/auth/register  { name, email }
  // Returns: { verificationRequired, user: { name, email } }
  register: (name: string, email: string) =>
    API.post('/auth/register', { name, email }).then((r) => r.data),

  verifyEmail: (token: string) =>
    API.get('/auth/verify-email', { params: { token } }).then((r) => r.data),

  resendVerification: (email: string) =>
    API.post('/auth/resend-verification', { email }).then((r) => r.data),

  // POST /api/auth/forgot-password  { email }
  // Returns: { message: '...' }
  forgotPassword: (email: string) =>
    API.post('/auth/forgot-password', { email }).then((r) => r.data),

  // POST /api/auth/reset-password  { token, newPassword }
  // Returns: { message: '...' }
  resetPassword: (token: string, newPassword: string) =>
    API.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};
