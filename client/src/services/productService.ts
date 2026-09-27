// API operations for the electronics catalog and product details.
import API from './api';
import type { ProductQuery } from '../types';

export const productService = {
  getProducts: (params: ProductQuery = {}) =>
    API.get('/products', { params }).then((r) => r.data),
  getProduct: (id: string) =>
    API.get(`/products/${id}`).then((r) => r.data),
};
