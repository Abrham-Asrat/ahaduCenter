import API from './api';

export const productService = {
  getProducts: (params = {}) =>
    API.get('/products', { params }).then((r) => r.data),
  getProduct: (id) =>
    API.get(`/products/${id}`).then((r) => r.data),
};
