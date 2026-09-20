import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';

export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.getNotifications();
      return Array.isArray(data) ? data : (data?.notifications ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch notifications');
    }
  }
);

export const markOneRead = createAsyncThunk(
  'notification/markOneRead',
  async (id, { rejectWithValue }) => {
    try {
      const data = await userService.markNotificationRead(id);
      return { id, data };
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to mark notification as read');
    }
  }
);

export const markAllRead = createAsyncThunk(
  'notification/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.markAllNotificationsRead();
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to mark all notifications as read');
    }
  }
);

export const clearAll = createAsyncThunk(
  'notification/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.deleteAllNotifications();
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to clear notifications');
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── fetchNotifications ──
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── markOneRead ──
      .addCase(markOneRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markOneRead.fulfilled, (state, action) => {
        state.loading = false;
        const targetId = action.payload.id;
        const target = state.notifications.find(
          (n) => n._id === targetId || n.id === targetId
        );
        if (target && !target.isRead) {
          target.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markOneRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── markAllRead ──
      .addCase(markAllRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach((n) => {
          n.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ── clearAll ──
      .addCase(clearAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAll.fulfilled, (state) => {
        state.loading = false;
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(clearAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationSlice.reducer;
