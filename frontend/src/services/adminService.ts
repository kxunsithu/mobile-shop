import api from './api';

export const adminService = {
  dashboard: () => api.get('/admin/dashboard').then(r => r.data),
  customers: (params?: any) => api.get('/admin/customers', { params }).then(r => r.data),
  customer: (id: number) => api.get(`/admin/customers/${id}`).then(r => r.data),
  updateCustomer: (id: number, payload: any) => api.put(`/admin/customers/${id}`, payload).then(r => r.data),
  inventory: (params?: any) => api.get('/admin/inventory', { params }).then(r => r.data),
  updateInventory: (id: number, payload: any) => api.put(`/admin/inventory/${id}`, payload).then(r => r.data),
};
