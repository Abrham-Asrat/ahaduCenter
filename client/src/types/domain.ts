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
  releaseYear?: string | number;
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
  bannerImage?: string;
  posterImage?: string;
  synopsis?: string;
  images?: string[];
  trailerThumbnail?: string;
  thumbnailUrl?: string;
  writers?: string | string[];
  director?: string;
 
  studio?: string;
  releaseDate?: string;
  quality?: string;
  screenshots?: string[];
  trailerUrl?: string;
  cast?: Array<{ _id?: string; id?: string; name: string; role?: string; character?: string; photoUrl?: string; photo?: string; image?: string }>;
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
  type?: string;
  createdAt?: string;
  date?: string;
  timestamp?: string;
  description?: string;
  isRead: boolean;
}

export interface Review {
  _id?: string;
  id?: string | number;
  user?: { name?: string; avatar?: string };
  name?: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  date?: string;
  helpfulCount?: number;
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

export interface ProductQuery {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
  condition?: string;
  brand?: string;
  maxPrice?: number;
  sort?: string;
}

export interface MovieQuery {
  page?: number;
  limit?: number;
  sort?: string;
  availability?: string;
  featured?: boolean;
  q?: string;
  country?: string;
  genre?: string;
  genres?: string;
}

export interface BookActionResult {
  dueDate?: string;
  expiryDate?: string;
  expiresAt?: string;
  pickupLocation?: string;
  _id?: string;
  data?: BookActionResult;
  borrowing?: BookActionResult;
  reservation?: BookActionResult;
}

export interface Borrowing {
  _id?: string;
  id?: string;
  bookId?: string | { _id?: string; id?: string; title?: string; author?: string; coverUrl?: string };
  title?: string;
  author?: string;
  coverUrl?: string;
  status: string;
  dueDate?: string;
  borrowDate?: string;
  returnDate?: string;
  renewalsLeft: number;
}
