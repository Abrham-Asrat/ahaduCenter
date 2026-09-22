// Stores electronics catalog and product detail request state.
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';
import type { PaginationState, Product, ProductQuery } from '../../types';

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// ── Product Thunks ──
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: ProductQuery = {}, { rejectWithValue }) => {
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
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await productService.getProduct(id);
      return data;
    } catch (err) {
      return rejectWithValue(typeof err === 'string' ? err : 'Failed to fetch product');
    }
  }
);

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    totalItems: 0,
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
          state.pagination = payload.pagination || {
            page: payload.page ?? 1,
            limit: payload.limit ?? state.pagination.limit,
            total: payload.totalCount ?? 0,
            totalPages: payload.totalPages ?? 0,
          };
        } else if (payload.products && Array.isArray(payload.products)) {
          state.products = payload.products;
          state.pagination = payload.pagination || {
            page: payload.page ?? 1,
            limit: payload.limit ?? state.pagination.limit,
            total: payload.totalCount ?? 0,
            totalPages: payload.totalPages ?? 0,
          };
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      })

      // Fetch Single Product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : null;
      });
  },
});

export default productSlice.reducer;
