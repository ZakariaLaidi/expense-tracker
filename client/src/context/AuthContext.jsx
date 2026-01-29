/**
 * Contexte d'authentification
 * Gère l'état de connexion de l'utilisateur dans toute l'application
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, getUser, setToken, setUser, logout as logoutStorage } from '../config/api';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    
    if (token && storedUser) {
      setUserState(storedUser);
    }
    setLoading(false);
  }, []);

  // Inscription
  const register = async (name, email, password) => {
    const response = await authService.register({ name, email, password });
    const { user, token } = response.data.data;
    
    setToken(token);
    setUser(user);
    setUserState(user);
    
    return response.data;
  };

  // Connexion
  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { user, token } = response.data.data;
    
    setToken(token);
    setUser(user);
    setUserState(user);
    
    return response.data;
  };

  // Déconnexion
  const logout = () => {
    logoutStorage();
    setUserState(null);
  };

  // Vérifie si l'utilisateur est connecté
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
