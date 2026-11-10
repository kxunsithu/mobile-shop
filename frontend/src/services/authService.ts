import api from './api';
import type { User } from '../types';

export const authService = {
  register: (payload: any) => api.post('/auth/register', payload).then(r => r.data),
  login: (payload: { email: string; password: string }) => api.post('/auth/login', payload).then(r => r.data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me').then(r => r.data as User),
  updateProfile: (payload: any) => api.put('/auth/profile', payload).then(r => r.data),
  changePassword: (payload: any) => api.put('/auth/password', payload).then(r => r.data),
};
