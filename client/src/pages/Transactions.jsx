/**
 * Page des transactions
 * Affiche la liste des transactions avec filtres et formulaire d'ajout
 */

import { useState, useEffect } from 'react';
import { transactionService, categoryService } from '../services/api';
import { 
  Plus, 
  Trash2, 
  Filter, 
  X, 
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  Search
} from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    month: '',
    type: '',
    categoryId: '',
  });

  // Formulaire
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: '',
    isRecurring: false,
    recurrence: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.type) params.type = filters.type;
      if (filters.categoryId) params.categoryId = filters.categoryId;

      const response = await transactionService.getAll(params);
      setTransactions(response.data.data.transactions || []);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.categoryId) {
      setFormError('Veuillez sélectionner une catégorie');
      return;
    }

    setSubmitting(true);

    try {
      await transactionService.create(formData);
      setShowModal(false);
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: 'EXPENSE',
        categoryId: '',
        isRecurring: false,
        recurrence: '',
      });
      fetchTransactions();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      return;
    }

    try {
      await transactionService.delete(id);
      fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
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
      month: 'long',
      year: 'numeric',
    });
  };

  const clearFilters = () => {
    setFilters({ month: '', type: '', categoryId: '' });
  };

  const hasFilters = filters.month || filters.type || filters.categoryId;

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-bar">
        <div className="filter-group">
          <Calendar size={18} />
          <input
            type="month"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            placeholder="Mois"
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">Tous les types</option>
            <option value="EXPENSE">Dépenses</option>
            <option value="INCOME">Revenus</option>
          </select>
        </div>

        <div className="filter-group">
          <Search size={18} />
          <select
            value={filters.categoryId}
            onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button className="btn btn-sm btn-secondary" onClick={clearFilters}>
            <X size={16} />
            Effacer
          </button>
        )}
      </div>

      {/* Liste des transactions */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.description || '-'}</td>
                  <td>
                    <span className="category-badge" style={{ backgroundColor: transaction.category?.color }}>
                      {transaction.category?.icon} {transaction.category?.name}
                    </span>
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                      {transaction.type === 'EXPENSE' ? (
                        <><ArrowDownCircle size={16} /> Dépense</>
                      ) : (
                        <><ArrowUpCircle size={16} /> Revenu</>
                      )}
                    </span>
                  </td>
                  <td className={`amount ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <button 
                      className="btn btn-icon btn-danger"
                      onClick={() => handleDelete(transaction.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>Aucune transaction trouvée</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={20} />
            Ajouter une transaction
          </button>
        </div>
      )}

      {/* Modal d'ajout */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouvelle transaction</h2>
              <button className="btn btn-icon" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && (
                <div className="alert alert-error">{formError}</div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-btn expense ${formData.type === 'EXPENSE' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    >
                      <ArrowDownCircle size={20} />
                      Dépense
                    </button>
                    <button
                      type="button"
                      className={`type-btn income ${formData.type === 'INCOME' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    >
                      <ArrowUpCircle size={20} />
                      Revenu
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="amount">Montant (DZD)</label>
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="categoryId">Catégorie</label>
                <select
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (optionnel)</label>
                <input
                  type="text"
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Courses au supermarché"
                />
              </div>

              {/* Option de récurrence */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      isRecurring: e.target.checked,
                      recurrence: e.target.checked ? 'MONTHLY' : ''
                    })}
                  />
                  <span className="checkbox-text">Transaction récurrente</span>
                </label>
              </div>

              {formData.isRecurring && (
                <div className="form-group recurrence-options">
                  <label>Fréquence de récurrence</label>
                  <div className="recurrence-selector">
                    <button
                      type="button"
                      className={`recurrence-btn ${formData.recurrence === 'DAILY' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, recurrence: 'DAILY' })}
                    >
                      Quotidienne
                    </button>
                    <button
                      type="button"
                      className={`recurrence-btn ${formData.recurrence === 'WEEKLY' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, recurrence: 'WEEKLY' })}
                    >
                      Hebdomadaire
                    </button>
                    <button
                      type="button"
                      className={`recurrence-btn ${formData.recurrence === 'MONTHLY' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, recurrence: 'MONTHLY' })}
                    >
                      Mensuelle
                    </button>
                    <button
                      type="button"
                      className={`recurrence-btn ${formData.recurrence === 'YEARLY' ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, recurrence: 'YEARLY' })}
                    >
                      Annuelle
                    </button>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
