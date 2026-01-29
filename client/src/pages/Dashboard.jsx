/**
 * Dashboard - Page principale avec statistiques
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statsService, transactionService } from '../services/api';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le filtre de dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Couleurs pour le graphique
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#B8B8B8'];

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const [summaryRes, categoryRes, monthlyRes, recentRes] = await Promise.all([
        statsService.getSummary(params),
        statsService.getByCategory(params),
        statsService.getMonthly({ months: 6 }),
        statsService.getRecent({ limit: 5 }),
      ]);

      setSummary(summaryRes.data.data);
      setCategoryStats(categoryRes.data.data.stats || []);
      setMonthlyStats(monthlyRes.data.data || []);
      setRecentTransactions(recentRes.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + ' DZD';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const getTodayDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Définir les raccourcis de période
  const setThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(getTodayDate());
  };

  const setThisYear = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(getTodayDate());
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Bonjour, {user?.name} 👋</h1>
          <p>Voici un aperçu de vos finances</p>
        </div>
        <div className="date-filter">
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Du</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || getTodayDate()}
              />
            </div>
            <div className="date-input-group">
              <label>Au</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={getTodayDate()}
              />
            </div>
          </div>
          <div className="date-shortcuts">
            <button className="btn btn-sm btn-secondary" onClick={setThisMonth}>
              Ce mois
            </button>
            <button className="btn btn-sm btn-secondary" onClick={setThisYear}>
              Cette année
            </button>
            {(startDate || endDate) && (
              <button className="btn btn-sm" onClick={clearFilters}>
                Tout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cartes de résumé */}
      <div className="stats-cards">
        <div className="stat-card income">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Revenus</span>
            <span className="stat-value">{formatCurrency(summary?.totalIncomes || 0)}</span>
          </div>
          <ArrowUpRight className="stat-arrow" size={20} />
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Dépenses</span>
            <span className="stat-value">{formatCurrency(summary?.totalExpenses || 0)}</span>
          </div>
          <ArrowDownRight className="stat-arrow" size={20} />
        </div>

        <div className={`stat-card balance ${(summary?.balance || 0) >= 0 ? 'positive' : 'negative'}`}>
          <div className="stat-icon">
            <Wallet size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Balance</span>
            <span className="stat-value">{formatCurrency(summary?.balance || 0)}</span>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="charts-container">
        {/* Répartition par catégorie */}
        <div className="chart-card">
          <h3>Répartition des dépenses</h3>
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category?.icon || ''} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="category.name"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.category?.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [formatCurrency(value), props.payload?.category?.name || 'Catégorie']}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>Aucune dépense enregistrée</p>
            </div>
          )}
        </div>

        {/* Évolution mensuelle */}
        <div className="chart-card">
          <h3>Évolution mensuelle</h3>
          {monthlyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyStats}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="incomes" name="Revenus" fill="#4ECDC4" />
                <Bar dataKey="expenses" name="Dépenses" fill="#FF6B6B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">
              <p>Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Transactions récentes */}
      <div className="recent-transactions">
        <h3>Transactions récentes</h3>
        {recentTransactions.length > 0 ? (
          <div className="transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-icon" style={{ backgroundColor: transaction.category?.color || '#B8B8B8' }}>
                  {transaction.category?.icon || '📦'}
                </div>
                <div className="transaction-info">
                  <span className="transaction-description">
                    {transaction.description || transaction.category?.name}
                  </span>
                  <span className="transaction-date">{formatDate(transaction.date)}</span>
                </div>
                <span className={`transaction-amount ${transaction.type.toLowerCase()}`}>
                  {transaction.type === 'EXPENSE' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">
            <p>Aucune transaction récente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
