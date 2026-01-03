import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getOne: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; color?: string; icon?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: { name?: string; color?: string; icon?: string }) =>
    api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Expenses API
export const expensesApi = {
  getAll: (params?: { startDate?: string; endDate?: string; categoryId?: string }) =>
    api.get('/expenses', { params }),
  getOne: (id: string) => api.get(`/expenses/${id}`),
  create: (data: { categoryId: string; amount: number; description?: string; date: string }) =>
    api.post('/expenses', data),
  update: (id: string, data: { categoryId?: string; amount?: number; description?: string; date?: string }) =>
    api.patch(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getMonthly: (year: number, month: number) =>
    api.get('/analytics/monthly', { params: { year, month } }),
  getYearly: (year: number) =>
    api.get('/analytics/yearly', { params: { year } }),
};
