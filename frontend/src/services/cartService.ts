import api from './api';
import type { Cart } from '../types';

export const cartService = {
  show: () => api.get('/cart').then(r => r.data as Cart),
  addItem: (payload: any) => api.post('/cart/items', payload).then(r => r.data as Cart),
  updateItem: (id: number, payload: any) => api.put(`/cart/items/${id}`, payload).then(r => r.data as Cart),
  removeItem: (id: number) => api.delete(`/cart/items/${id}`).then(r => r.data as Cart),
  clear: () => api.delete('/cart').then(r => r.data as Cart),
};
