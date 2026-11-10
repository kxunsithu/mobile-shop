import api from './api';
import type { Order, Paginated } from '../types';

export const orderService = {
  list: (params?: any) => api.get('/orders', { params }).then(r => r.data as Paginated<Order>),
  get: (id: number) => api.get(`/orders/${id}`).then(r => r.data as Order),
  create: (payload: any) => api.post('/orders', payload).then(r => r.data as Order),
  cancel: (id: number) => api.post(`/orders/${id}/cancel`).then(r => r.data as Order),
  adminList: (params?: any) => api.get('/admin/orders', { params }).then(r => r.data),
  adminGet: (id: number) => api.get(`/admin/orders/${id}`).then(r => r.data),
  adminUpdate: (id: number, payload: any) => api.put(`/admin/orders/${id}`, payload).then(r => r.data),
  adminCancel: (id: number) => api.post(`/admin/orders/${id}/cancel`).then(r => r.data),
};
