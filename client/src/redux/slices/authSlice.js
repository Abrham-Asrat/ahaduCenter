import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../../services/authService';

// ── Synchronous rehydration (runs at module load, before any component mounts) ─
// Reads the token from localStorage, decodes it, and rejects it if expired.
// This keeps `initialized` always `true` by the time the first render happens.
const _token = localStorage.getItem('token');
let _user = null;
let _validToken = null;

if (_token) {
  try {
    const decoded = jwtDecode(_token); // { id, name, email, role, iat, exp }
    if (decoded.exp * 1000 > Date.now()) {
      // Token is still valid — hydrate user from claims
      _user = { name: decoded.name, email: decoded.email, role: decoded.role };
      _validToken = _token;
    } else {
      // Token has expired — clean it up
      localStorage.removeItem('token');
    }
  } catch {
    // Token is malformed / cannot be decoded — clean it up
    localStorage.removeItem('token');
  }
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Async thunks ──────────────────────────────────────────────────────────────

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      return data; // { token, user }
    } catch (err) {
      return rejectWithValue(err); // err is already a plain string from api.js interceptor
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('token', data.token);
      return data; // { token, user }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────

const initialState = {
  user: _user,          // { name, email, role } | null
  token: _validToken,   // JWT string | null
  loading: false,
  error: null,
  initialized: true,    // always true — rehydration is synchronous
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutAction: (state) => {
      localStorage.removeItem('token');
      state.user  = null;
      state.token = null;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginThunk
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user  = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      // registerThunk
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user  = action.payload.user;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { logoutAction, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
