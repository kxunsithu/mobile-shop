import api from './api';
import type { Product, Paginated } from '../types';

export const productService = {
  list: (params?: any) => api.get('/products', { params }).then(r => r.data as Paginated<Product>),
  get: (id: number | string) => api.get(`/products/${id}`).then(r => r.data),
  // admin
  adminList: (params?: any) => api.get('/admin/products', { params }).then(r => r.data),
  create: (payload: any) => api.post('/admin/products', payload).then(r => r.data),
  update: (id: number, payload: any) => api.put(`/admin/products/${id}`, payload).then(r => r.data),
  delete: (id: number) => api.delete(`/admin/products/${id}`).then(r => r.data),
};
