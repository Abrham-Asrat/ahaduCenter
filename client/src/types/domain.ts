export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: 'user' | 'admin' | string;
  avatarUrl?: string | null;
}

export interface Book {
  _id?: string;
  id?: string;
  title: string;
  author?: string;
  coverUrl?: string;
  availability?: string;
  price?: number;
  waitlist?: number;
  category?: string;
  description?: string;
  publisher?: string;
  year?: string | number;
  isbn?: string;
  rating?: number;
  about?: string;
  coverImage?: string;
  reviews?: number;
  availableCopies?: number;
  location?: string;
  format?: string;
  pages?: number;
  language?: string;
  publicationDate?: string;
  dimensions?: string;
  authorInfo?: string;
  borrowingPolicy?: string;
  [key: string]: unknown;
}

export interface Movie {
  _id?: string;
  id?: string;
  title: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres?: string[];
  rating?: number;
  year?: string | number;
  country?: string;
  runtime?: string;
  
  language?: string;
  subtitles?: string;
  availability?: string;
  bannerUrl?: string;
  director?: string;
  writers?: string;
  studio?: string;
  releaseDate?: string;
  quality?: string;
  screenshots?: string[];
  trailerUrl?: string;
  cast?: Array<{ id?: string; name: string; role?: string; photoUrl?: string }>;
  [key: string]: unknown;
}

export interface Product {
  _id?: string;
  id?: string;
  title: string;
  name?: string;
  imageUrl?: string;
  images?: string[];
  category?: string;
  price?: number;
  brand?: string;
  condition?: 'New' | 'Used' | 'Refurbished' | string;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  description?: string;
  highlights?: string[];
  [key: string]: unknown;
}

export interface WishlistItem {
  id?: string;
  itemId: string;
  itemType?: string;
  title?: string;
  imageUrl?: string | null;
  category?: string | null;
  addedAt?: string;
}

export interface Notification {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  isRead: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  totalItems?: number;
  currentPage?: number;
}

export interface BookQuery {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  availability?: string;
  language?: string;
  format?: string;
  sort?: string;
}

export interface BookActionResult {
  dueDate?: string;
  expiryDate?: string;
  pickupLocation?: string;
  _id?: string;
  data?: BookActionResult;
  borrowing?: BookActionResult;
  reservation?: BookActionResult;
}
