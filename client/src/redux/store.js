import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import productReducer from './slices/productSlice';
import bookReducer from './slices/bookSlice';

import wishlistReducer from './slices/wishlistSlice';
import notificationReducer from './slices/notificationSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    product: productReducer,
    book: bookReducer,

    wishlist: wishlistReducer,
    notification: notificationReducer,
    admin: adminReducer,
  },
});
