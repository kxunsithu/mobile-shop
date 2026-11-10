import api from './api';
import type { Address } from '../types';

export const addressService = {
  list: () => api.get('/addresses').then(r => r.data as Address[]),
  create: (payload: any) => api.post('/addresses', payload).then(r => r.data as Address),
  update: (id: number, payload: any) => api.put(`/addresses/${id}`, payload).then(r => r.data as Address),
  delete: (id: number) => api.delete(`/addresses/${id}`).then(r => r.data),
};
