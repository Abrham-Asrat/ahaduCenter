import API from './api';

export const orderService = {
  // POST /api/orders  { productId, quantity }  (auth required)
  placeOrder: (payload) =>
    API.post('/orders', payload).then((r) => r.data),

  // GET /api/orders/:id  (auth required)
  getOrder: (id) =>
    API.get(`/orders/${id}`).then((r) => r.data),

  // GET /api/users/me/orders  (auth required)
  getOrderHistory: () =>
    API.get('/users/me/orders').then((r) => r.data),
};
