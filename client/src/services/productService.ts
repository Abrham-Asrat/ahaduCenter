// API operations for the electronics catalog and product details.
import API from './api';

export const productService = {
  getProducts: (params: object = {}) =>
    API.get('/products', { params }).then((r) => r.data),
  getProduct: (id: string) =>
    API.get(`/products/${id}`).then((r) => r.data),
};
