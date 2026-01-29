/**
 * Configuration de l'API
 */

// URL de l'API - utilise la variable d'environnement en production
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Récupère le token JWT stocké
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Stocke le token JWT
 */
export const setToken = (token) => localStorage.setItem('token', token);

/**
 * Supprime le token JWT
 */
export const removeToken = () => localStorage.removeItem('token');

/**
 * Récupère les informations utilisateur stockées
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Stocke les informations utilisateur
 */
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

/**
 * Supprime les informations utilisateur
 */
export const removeUser = () => localStorage.removeItem('user');

/**
 * Déconnexion complète
 */
export const logout = () => {
  removeToken();
  removeUser();
};
