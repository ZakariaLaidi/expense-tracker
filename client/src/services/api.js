/**
 * Service API - Gestion des requêtes HTTP
 */

import axios from 'axios';
import { API_URL, getToken, logout } from '../config/api';

// Création de l'instance Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTIFICATION
// ============================================

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
};

// ============================================
// TRANSACTIONS
// ============================================

export const transactionService = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// ============================================
// CATÉGORIES
// ============================================

export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ============================================
// STATISTIQUES
// ============================================

export const statsService = {
  getSummary: (params) => api.get('/stats/summary', { params }),
  getByCategory: (params) => api.get('/stats/by-category', { params }),
  getMonthly: (params) => api.get('/stats/monthly', { params }),
  getRecent: (params) => api.get('/stats/recent', { params }),
};

export default api;
