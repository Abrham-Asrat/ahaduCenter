// Stores the authenticated user's wishlist and mutation request state.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import type { WishlistItem } from '../../types';

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  pendingByItem: Record<string, number>;
}

interface WishlistPayload {
  itemId: string;
  itemType: string;
  title?: string;
  imageUrl?: string | null;
  category?: string | null;
}

let wishlistSnapshot: WishlistItem[] = [];

export const normalizeWishlistId = (value: unknown) => String(value ?? '').trim();

export const wishlistItemMatches = (item: WishlistItem, itemId: string) => {
  const targetId = normalizeWishlistId(itemId);
  const sourceId = normalizeWishlistId(item.itemId);
  if (sourceId && sourceId === targetId) return true;

  const match = item.link?.match(/^\/(?:books|movies|electronics)\/([^/?#]+)/);
  return Boolean(match?.[1] && decodeURIComponent(match[1]) === targetId);
};

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
      const currentList = await userService.getWishlist();
      const currentItems = Array.isArray(currentList) ? currentList : (currentList?.items ?? []);
      const alreadySaved = currentItems.some(
        (item: WishlistItem) => wishlistItemMatches(item, payload.itemId)
      );

      if (alreadySaved) return currentItems;

      await userService.addToWishlist(payload);
      // Re-fetch to ensure complete item metadata is populated from backend
      const updatedList = await userService.getWishlist();
      return updatedList;
    } catch (err) {
      if (typeof err === 'string' && /already in your wishlist/i.test(err)) {
        const updatedList = await userService.getWishlist();
        return updatedList;
      }
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to add item to wishlist');
    }
  },
  {
    condition: (payload, { getState }) => {
      const state = getState() as { wishlist?: { pendingByItem?: Record<string, number> } };
      const itemId = normalizeWishlistId(payload.itemId);
      return Boolean(itemId) && (state.wishlist?.pendingByItem?.[itemId] ?? 0) === 0;
    },
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
  pendingByItem: {},
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
        const itemId = normalizeWishlistId(arg?.itemId);
        state.pendingByItem[itemId] = (state.pendingByItem[itemId] ?? 0) + 1;
        state.loading = true;
        state.error = null;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        const itemId = normalizeWishlistId(action.meta.arg.itemId);
        state.pendingByItem[itemId] = Math.max(0, (state.pendingByItem[itemId] ?? 1) - 1);
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        }
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        const itemId = normalizeWishlistId(action.meta.arg.itemId);
        state.pendingByItem[itemId] = Math.max(0, (state.pendingByItem[itemId] ?? 1) - 1);
        state.items = wishlistSnapshot;
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })

      // ── removeWishlistItem ──
      .addCase(removeWishlistItem.pending, (state, action) => {
        wishlistSnapshot = JSON.parse(JSON.stringify(state.items));
        const targetId = action.meta.arg;
        state.items = state.items.filter(
          (item) => !wishlistItemMatches(item, targetId)
        );
        const itemId = normalizeWishlistId(targetId);
        state.pendingByItem[itemId] = (state.pendingByItem[itemId] ?? 0) + 1;
        state.loading = true;
        state.error = null;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        const itemId = normalizeWishlistId(action.meta.arg);
        state.pendingByItem[itemId] = Math.max(0, (state.pendingByItem[itemId] ?? 1) - 1);
        state.loading = false;
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        const itemId = normalizeWishlistId(action.meta.arg);
        state.pendingByItem[itemId] = Math.max(0, (state.pendingByItem[itemId] ?? 1) - 1);
        state.items = wishlistSnapshot;
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      });
  },
});

export default wishlistSlice.reducer;
