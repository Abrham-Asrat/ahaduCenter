// API operations for checkout and purchase history.
import API from './api';

export const orderService = {
  // POST /api/orders  { productId, quantity }  (auth required)
  placeOrder: (payload: unknown) =>
    API.post('/orders', payload).then((r) => r.data),

  // GET /api/orders/:id  (auth required)
  getOrder: (id: string) =>
    API.get(`/orders/${id}`).then((r) => r.data),

  // GET /api/users/me/orders  (auth required)
  getOrderHistory: (params: Record<string, unknown> = {}) =>
    API.get('/users/me/orders', { params }).then((r) => r.data),
};
