/**
 * Composant de protection des routes
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Affichage d'un loader pendant la vérification
  if (loading) {
    return (
      <div className="loading-container full-page">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Affichage du layout avec navbar
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;
