// API operation for cross-domain search results.
import API from './api';

export const searchService = {
  search: (params: Record<string, unknown>) => API.get('/search', { params }).then((r) => r.data),
};
