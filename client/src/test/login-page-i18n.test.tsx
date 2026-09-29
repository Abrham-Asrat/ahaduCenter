import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../pages/LoginPage';
import authReducer from '../redux/slices/authSlice';
import languageReducer from '../redux/slices/languageSlice';
import i18n from '../i18n/config';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
  },
}));

const renderPage = async (language = 'en') => {
  await i18n.changeLanguage(language);

  const store = configureStore({
    reducer: {
      auth: authReducer,
      language: languageReducer,
    },
    preloadedState: {
      language: { language },
    },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('LoginPage i18n Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders in English by default', async () => {
    await renderPage('en');

    // Check page title
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();

    // Check subtitle
    expect(screen.getByText('Sign in securely with your Google account')).toBeInTheDocument();

    // Check email label
    expect(screen.getByText('Registered Email Address')).toBeInTheDocument();

    // Check email placeholder
    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toBeInTheDocument();

    // Check login button
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    // Check resend verification button
    expect(screen.getByText('Resend verification email')).toBeInTheDocument();

    // Check account creation link
    expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('renders in Amharic when language is set to am', async () => {
    await renderPage('am');

    // Check page title
    expect(screen.getByText('እንኳን ደህና መጡ')).toBeInTheDocument();

    // Check subtitle
    expect(screen.getByText('በጉግል መለያዎ በደህና ይግቡ')).toBeInTheDocument();

    // Check email label
    expect(screen.getByText('የተመዘገበ የኢሜይል አድራሻ')).toBeInTheDocument();

    // Check login button
    expect(screen.getByRole('button', { name: /ግባ/i })).toBeInTheDocument();

    // Check resend verification button
    expect(screen.getByText('የማረጋገጫ ኢሜይል እንደገና ላክ')).toBeInTheDocument();

    // Check account creation link text
    expect(screen.getByText(/መለያ የለዎትም\?/i)).toBeInTheDocument();
    expect(screen.getByText('መለያ ፍጠር')).toBeInTheDocument();
  });

  it('has accessible aria-label for close button', async () => {
    await renderPage('en');

    // Check close button aria-label
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('has accessible aria-label for close button in Amharic', async () => {
    await renderPage('am');

    // Check close button aria-label in Amharic
    const closeButton = screen.getByLabelText('ዝጋ');
    expect(closeButton).toBeInTheDocument();
  });
});
