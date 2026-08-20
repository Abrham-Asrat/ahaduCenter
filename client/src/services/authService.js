import API from './api';

export const authService = {
  // POST /api/auth/login  { email, password }
  // Returns: { token, user: { name, email, role } }
  login: (email, password) =>
    API.post('/auth/login', { email, password }).then((r) => r.data),

  // POST /api/auth/register  { name, email, password }
  // Returns: { token, user: { name, email, role } }
  register: (name, email, password) =>
    API.post('/auth/register', { name, email, password }).then((r) => r.data),

  // POST /api/auth/forgot-password  { email }
  // Returns: { message: '...' }
  forgotPassword: (email) =>
    API.post('/auth/forgot-password', { email }).then((r) => r.data),

  // POST /api/auth/reset-password  { token, newPassword }
  // Returns: { message: '...' }
  resetPassword: (token, newPassword) =>
    API.post('/auth/reset-password', { token, newPassword }).then((r) => r.data),
};
