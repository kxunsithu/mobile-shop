import api from './api';
import type { Brand, Paginated } from '../types';

export const brandService = {
  list: (params?: any) => api.get('/brands', { params }).then(r => r.data as Paginated<Brand> | Brand[]),
  get: (id: number) => api.get(`/brands/${id}`).then(r => r.data as Brand),
  adminList: (params?: any) => api.get('/admin/brands', { params }).then(r => r.data),
  create: (payload: any) => api.post('/admin/brands', payload).then(r => r.data),
  update: (id: number, payload: any) => api.put(`/admin/brands/${id}`, payload).then(r => r.data),
  delete: (id: number) => api.delete(`/admin/brands/${id}`).then(r => r.data),
};
