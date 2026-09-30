import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from './ProductCard';
import authReducer from '../../redux/slices/authSlice';
import wishlistReducer from '../../redux/slices/wishlistSlice';
import '../../i18n/config';

// Mock product data
const mockProduct = {
  _id: 'test-product-1',
  title: 'Test Laptop',
  name: 'Test Laptop',
  brand: 'TestBrand',
  condition: 'New',
  price: 999,
  rating: 4.5,
  reviews: 42,
  imageUrl: 'https://example.com/image.jpg',
  category: 'Laptops',
};

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      wishlist: wishlistReducer,
    },
    preloadedState: {
      auth: {
        token: null,
        user: null,
        loading: false,
        error: null,
      },
      wishlist: {
        items: [],
        loading: false,
        error: null,
        pendingByItem: {},
      },
    },
  });
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    // Check if product title is displayed
    expect(screen.getByText('Test Laptop')).toBeDefined();
    
    // Check if brand is displayed
    expect(screen.getByText('TestBrand')).toBeDefined();
    
    // Check if price is displayed
    expect(screen.getByText('$999')).toBeDefined();
  });

  it('displays translated button labels', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    // Check for translated "Compare Products" text (from electronics.compare key)
    expect(screen.getByText('Compare Products')).toBeDefined();
    
    // Check for translated "Add" button (from electronics.addButton key)
    expect(screen.getByText('Add')).toBeDefined();
  });

  it('uses translation keys for accessibility attributes', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    // Check for aria-label with product title interpolation
    const viewDetailsLink = screen.getByRole('link', { 
      name: /View details for Test Laptop/i 
    });
    expect(viewDetailsLink).toBeDefined();
  });

  it('displays reviews count with translation', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    // Check for reviews count with translated "reviews" text
    expect(screen.getByText(/42 reviews/i)).toBeDefined();
  });

  it('handles missing brand with default translation', () => {
    const store = createMockStore();
    const productWithoutBrand = { ...mockProduct, brand: undefined };
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={productWithoutBrand} />
        </BrowserRouter>
      </Provider>
    );

    // Should display default brand from translation (electronics.defaultBrand = "Premium")
    expect(screen.getByText('Premium')).toBeDefined();
  });

  it('handles missing condition with default translation', () => {
    const store = createMockStore();
    const productWithoutCondition = { ...mockProduct, condition: undefined };
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={productWithoutCondition} />
        </BrowserRouter>
      </Provider>
    );

    // Should display default condition from translation (electronics.conditionNew = "New")
    expect(screen.getByText('New')).toBeDefined();
  });
});
