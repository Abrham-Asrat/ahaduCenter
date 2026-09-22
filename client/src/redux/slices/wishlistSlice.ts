// Stores the authenticated user's wishlist and mutation request state.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import type { WishlistItem } from '../../types';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

interface WishlistPayload {
  itemId: string;
  itemType: string;
  title?: string;
  imageUrl?: string | null;
  category?: string | null;
}

let wishlistSnapshot: WishlistItem[] = [];

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const data = await userService.getWishlist();
      return Array.isArray(data) ? data : (data?.items ?? []);
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch wishlist');
    }
  }
);

export const addWishlistItem = createAsyncThunk(
  'wishlist/addWishlistItem',
  async (payload: WishlistPayload, { rejectWithValue }) => {
    try {
      await userService.addToWishlist(payload);
      // Re-fetch to ensure complete item metadata is populated from backend
      const updatedList = await userService.getWishlist();
      return updatedList;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to add item to wishlist');
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  'wishlist/removeWishlistItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const res = await userService.removeFromWishlist(itemId);
      return { itemId, res };
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to remove item from wishlist');
    }
  }
);

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── fetchWishlist ──
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })

      // ── addWishlistItem ──
      .addCase(addWishlistItem.pending, (state, action) => {
        wishlistSnapshot = JSON.parse(JSON.stringify(state.items));
        const arg = action.meta.arg;
        const optimisticEntry = {
          id: arg?.itemId ?? `temp-${Date.now()}`,
          itemId: arg?.itemId,
          itemType: arg?.itemType,
          title: arg?.title ?? 'Adding...',
          imageUrl: arg?.imageUrl ?? null,
          category: arg?.category ?? null,
          addedAt: new Date().toISOString(),
        };
        state.items.unshift(optimisticEntry);
        state.loading = true;
        state.error = null;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.items = wishlistSnapshot;
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })

      // ── removeWishlistItem ──
      .addCase(removeWishlistItem.pending, (state, action) => {
        wishlistSnapshot = JSON.parse(JSON.stringify(state.items));
        const targetId = action.meta.arg;
        state.items = state.items.filter(
          (item) => item.id !== targetId && item.itemId !== targetId
        );
        state.loading = true;
        state.error = null;
      })
      .addCase(removeWishlistItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.items = wishlistSnapshot;
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      });
  },
});

export default wishlistSlice.reducer;
