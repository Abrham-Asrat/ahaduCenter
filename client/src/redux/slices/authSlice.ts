// Stores the authenticated user, token lifecycle, and auth request state.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface GoogleAuthPayload {
  credential: string;
}

interface AdminLoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
}

// ── Auth Thunks ──
export const loginThunk = createAsyncThunk(
  'auth/googleLogin',
  async ({ credential }: GoogleAuthPayload, { rejectWithValue }) => {
    try {
      const data = await authService.loginWithGoogle(credential);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to login');
    }
  }
);

export const googleRegisterThunk = createAsyncThunk(
  'auth/googleRegister',
  async ({ credential }: GoogleAuthPayload, { rejectWithValue }) => {
    try {
      const data = await authService.registerWithGoogle(credential);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to register with Google');
    }
  }
);

export const adminLoginThunk = createAsyncThunk(
  'auth/adminLogin',
  async ({ email, password }: AdminLoginPayload, { rejectWithValue }) => {
    try {
      const data = await authService.adminLogin(email, password);
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to login as admin');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email }: RegisterPayload, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to register');
    }
  }
);

export const verifyEmailThunk = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(token);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Unable to verify email');
    }
  }
);

export const resendVerificationThunk = createAsyncThunk(
  'auth/resendVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      return await authService.resendVerification(email);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Unable to resend verification email');
    }
  }
);

export const bootstrapAuthThunk = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    if (!localStorage.getItem('token')) return null;
    try {
      return await userService.getProfile();
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue(typeof err === 'string' ? err : 'Session expired');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAction: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
        state.initialized = true;
      })
      .addCase(googleRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
      })
      .addCase(googleRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
        state.initialized = true;
      })
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.initialized = true;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
        state.initialized = true;
      })

      .addCase(bootstrapAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload ? localStorage.getItem('token') : null;
        state.initialized = true;
      })
      .addCase(bootstrapAuthThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.initialized = true;
      })

      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.initialized = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
        state.initialized = true;
      })

      .addCase(verifyEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })
      .addCase(resendVerificationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendVerificationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      });
  },
});

export const { logoutAction, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
