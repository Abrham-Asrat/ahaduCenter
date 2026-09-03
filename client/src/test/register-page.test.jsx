import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import RegisterPage from '../pages/RegisterPage';
import authReducer from '../redux/slices/authSlice';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    register: vi.fn(),
  },
}));

const renderPage = () => {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>
  );
};

describe('RegisterPage passwordless registration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authService.register.mockResolvedValue({
      verificationRequired: true,
      user: { name: 'Test User', email: 'test@example.com' },
    });
  });

  it('submits only full name and email', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(authService.register).toHaveBeenCalledWith('Test User', 'test@example.com'));
    expect(screen.queryByLabelText(/^password$/i)).not.toBeInTheDocument();
  });

  it('shows server errors', async () => {
    authService.register.mockRejectedValueOnce('Email is already registered');
    renderPage();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText('Email is already registered')).toBeInTheDocument();
  });
});
