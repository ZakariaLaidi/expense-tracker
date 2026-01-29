/**
 * Composant Navbar - Barre de navigation principale
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, ArrowRightLeft, Tags, LogOut, Wallet, Sun, Moon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Wallet size={28} />
          <span>ExpenseTracker</span>
        </div>

        <div className="navbar-menu">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Finances</span>
          </NavLink>

          <NavLink 
            to="/transactions" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <ArrowRightLeft size={20} />
            <span>Transactions</span>
          </NavLink>

          <NavLink 
            to="/categories" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Tags size={20} />
            <span>Catégories</span>
          </NavLink>
        </div>

        <div className="navbar-user">
          {/* Bouton de changement de thème */}
          <button 
            className="btn-theme-toggle" 
            onClick={toggleTheme}
            title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <span className="user-name">Bonjour, {user?.name}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
