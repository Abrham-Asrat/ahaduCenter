import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { logoutAction } from '../redux/slices/authSlice';
import { store } from '../redux/store';
import type { ApiError } from '../types';

const api = axios.create({
  baseURL: ENV.API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const data = error.response.data;

      if (error.response.status === 401 && !error.config?.url?.startsWith('/auth/')) {
        store.dispatch(logoutAction());
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }

      const message =
        (typeof data === 'object' && data !== null && ('error' in data || 'message' in data)
          ? data.error ?? data.message
          : undefined) || `Request failed (${error.response.status})`;

      return Promise.reject(message);
    }

    return Promise.reject('Network error. Please check your connection.');
  }
);

export function toApiError(err: unknown): ApiError {
  if (typeof err === 'string') {
    return { message: err, code: 'UNKNOWN_ERROR' };
  }

  if (err && typeof err === 'object' && 'message' in err) {
    const message = err.message;
    return {
      message: typeof message === 'string' ? message : 'Request failed',
      code: 'API_ERROR',
    };
  }

  return { message: 'Request failed', code: 'UNKNOWN_ERROR' };
}

export default api;
