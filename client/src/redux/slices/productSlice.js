import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

// ── Product Thunks ──
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProduct(id);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch product');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        // Handle different response formats
        if (Array.isArray(payload)) {
          state.products = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.products = payload.data;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        } else if (payload.products && Array.isArray(payload.products)) {
          state.products = payload.products;
          if (payload.pagination) {
            state.pagination = payload.pagination;
          }
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
