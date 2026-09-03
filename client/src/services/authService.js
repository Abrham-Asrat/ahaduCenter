import API from './api';

export const authService = {
  // POST /api/auth/google  { credential }
  loginWithGoogle: (credential) =>
    API.post('/auth/google', { credential }).then((r) => r.data),

  // POST /api/auth/admin-login  { email, password }
  adminLogin: (email, password) =>
    API.post('/auth/admin-login', { email, password }).then((r) => r.data),

  // POST /api/auth/register  { name, email }
  // Returns: { verificationRequired, user: { name, email } }
  register: (name, email) =>
    API.post('/auth/register', { name, email }).then((r) => r.data),

  verifyEmail: (token) =>
    API.get('/auth/verify-email', { params: { token } }).then((r) => r.data),

  resendVerification: (email) =>
    API.post('/auth/resend-verification', { email }).then((r) => r.data),

  // POST /api/auth/forgot-password  { email }
  // Returns: { message: '...' }
  forgotPassword: (email) =>
    API.post('/auth/forgot-password', { email }).then((r) => r.data),

  // POST /api/auth/reset-password  { token, newPassword }
  // Returns: { message: '...' }
  resetPassword: (token, newPassword) =>
    API.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};
