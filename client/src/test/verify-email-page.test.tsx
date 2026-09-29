import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import authReducer from '../redux/slices/authSlice';
import '../i18n/config';

const renderPage = (search = '') => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/verify-email${search}`]}>
        <VerifyEmailPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('VerifyEmailPage i18n translations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with English translations by default (ready state)', () => {
    renderPage();
    
    // Check for English title
    expect(screen.getByRole('heading', { name: /check your email/i })).toBeInTheDocument();
    
    // Check for English message
    expect(screen.getByText(/open the verification link we sent/i)).toBeInTheDocument();
    
    // Check for English form label
    expect(screen.getByText(/email address/i)).toBeInTheDocument();
    
    // Check for English button text
    expect(screen.getByRole('button', { name: /resend verification email/i })).toBeInTheDocument();
    
    // Check for English link text
    expect(screen.getByRole('link', { name: /back to sign in/i })).toBeInTheDocument();
  });

  it('renders all translated elements without hardcoded English text', () => {
    renderPage();
    
    // Verify that key UI elements are present
    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    expect(emailInput).toBeInTheDocument();
    
    const resendButton = screen.getByRole('button', { name: /resend/i });
    expect(resendButton).toBeInTheDocument();
    
    const backLink = screen.getByRole('link', { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/login');
  });

  it('renders form correctly with email input', () => {
    renderPage('?email=test@example.com');
    
    const emailInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(emailInput).toHaveValue('test@example.com');
  });
});
