import API from './api';

export const userService = {
  // ── Profile ──
  getProfile: () => API.get('/users/me').then((r) => r.data),
  updateProfile: (payload) => API.put('/users/me', payload).then((r) => r.data),
  uploadAvatar: (formData) =>
    API.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  getUserStats: () => API.get('/users/me/stats').then((r) => r.data),
  getUserActivity: () => API.get('/users/me/activity').then((r) => r.data),

  // ── Borrowings ──
  getBorrowingHistory: () => API.get('/users/me/borrowings').then((r) => r.data),
  renewBorrowing: (borrowingId) =>
    API.post(`/borrowings/${borrowingId}/renew`).then((r) => r.data),
  returnBook: (borrowingId) =>
    API.post(`/borrowings/${borrowingId}/return`).then((r) => r.data),

  // ── Wishlist ──
  getWishlist: () => API.get('/users/me/wishlist').then((r) => r.data),
  addToWishlist: (payload) => API.post('/users/me/wishlist', payload).then((r) => r.data),
  removeFromWishlist: (itemId) =>
    API.delete(`/users/me/wishlist/${itemId}`).then((r) => r.data),

  // ── Notifications ──
  getNotifications: () => API.get('/users/me/notifications').then((r) => r.data),
  markNotificationRead: (id) =>
    API.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllNotificationsRead: () =>
    API.post('/users/me/notifications/read-all').then((r) => r.data),
  deleteAllNotifications: () =>
    API.delete('/users/me/notifications').then((r) => r.data),
};
