import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// ── 16.2: fetchProducts thunk ─────────────────────────────────────────────────
// Server envelope: { data: [...], totalCount, page, totalPages, limit }
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      return await productService.getProducts(params);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 16.3: fetchProduct thunk ──────────────────────────────────────────────────
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await productService.getProduct(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ── 16.1: Initial state ───────────────────────────────────────────────────────
const initialState = {
  products:        [],
  selectedProduct: null,
  loading:         false,
  error:           null,
  pagination: {
    totalItems:  0,
    totalPages:  0,
    currentPage: 1,
    limit:       12,
  },
};

// ── Slice ─────────────────────────────────────────────────────────────────────
export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ── 16.4: pending / rejected wiring ──────────────────────────────────────
    [fetchProducts, fetchProduct].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error   = null;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error   = action.payload;
        });
    });

    // ── Fulfilled cases ───────────────────────────────────────────────────────

    // 16.2: fetchProducts — map server envelope to slice state
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading    = false;
      state.products   = action.payload.data;
      state.pagination = {
        totalItems:  action.payload.totalCount,
        totalPages:  action.payload.totalPages,
        currentPage: action.payload.page,
        limit:       action.payload.limit,
      };
    });

    // 16.3: fetchProduct — set selectedProduct
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.loading         = false;
      state.selectedProduct = action.payload;
    });
  },
});

export default productSlice.reducer;
