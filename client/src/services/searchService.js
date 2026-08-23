import API from './api';

export const searchService = {
  search: (params) => API.get('/search', { params }).then((r) => r.data),
};
