// @ts-nocheck
// API operation for cross-domain search results.
import API from './api';

export const searchService = {
  search: (params) => API.get('/search', { params }).then((r) => r.data),
};
