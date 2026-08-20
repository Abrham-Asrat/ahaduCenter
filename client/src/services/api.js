// client/src/services/api.js
import axios from 'axios';
import { store } from '../redux/store';
import { logoutAction } from '../redux/slices/authSlice';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// ── Request interceptor ──────────────────────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: error normalisation ─────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      if (error.response.status === 401) {
        store.dispatch(logoutAction());
        window.location.href = '/login';
        return Promise.reject('Session expired. Please log in again.');
      }
      const message =
        data?.error || data?.message || `Request failed (${error.response.status})`;
      return Promise.reject(message);
    }
    return Promise.reject('Network error. Please check your connection.');
  }
);

export default API;
