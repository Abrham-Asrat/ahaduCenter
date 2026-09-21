// @ts-nocheck
// API operation for submitting public contact messages.
import API from './api';

export const contactService = {
  submitContact: (payload) => API.post('/contact', payload).then((r) => r.data),
};
