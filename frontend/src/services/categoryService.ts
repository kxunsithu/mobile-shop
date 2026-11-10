import api from './api';
import type { Category, Paginated } from '../types';

export const categoryService = {
  list: (params?: any) => api.get('/categories', { params }).then(r => r.data as Paginated<Category> | Category[]),
  get: (id: number) => api.get(`/categories/${id}`).then(r => r.data as Category),
  adminList: (params?: any) => api.get('/admin/categories', { params }).then(r => r.data),
  create: (payload: any) => api.post('/admin/categories', payload).then(r => r.data),
  update: (id: number, payload: any) => api.put(`/admin/categories/${id}`, payload).then(r => r.data),
  delete: (id: number) => api.delete(`/admin/categories/${id}`).then(r => r.data),
};
