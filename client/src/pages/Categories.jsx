/**
 * Page des catégories
 * Gestion des catégories de transactions
 */

import { useState, useEffect } from 'react';
import { categoryService } from '../services/api';
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Formulaire
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#4ECDC4',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Liste d'emojis suggérés
  const suggestedEmojis = ['🍔', '🚗', '🏠', '🎮', '💊', '🛍️', '💰', '📦', '✈️', '🎬', '📚', '💡', '🏋️', '🎵', '☕'];

  // Couleurs suggérées
  const suggestedColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#B8B8B8', '#FF9F43', '#6C5CE7'];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        icon: category.icon || '📦',
        color: category.color || '#4ECDC4',
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', icon: '📦', color: '#4ECDC4' });
    }
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', icon: '📦', color: '#4ECDC4' });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      await categoryService.delete(id);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Catégories</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : categories.length > 0 ? (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <div className="category-icon" style={{ backgroundColor: category.color }}>
                {category.icon || '📦'}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <span className="transaction-count">
                  {category._count?.transactions || 0} transaction(s)
                </span>
              </div>
              <div className="category-actions">
                <button 
                  className="btn btn-icon"
                  onClick={() => openModal(category)}
                  title="Modifier"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="btn btn-icon btn-danger"
                  onClick={() => handleDelete(category.id)}
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Tag size={48} />
          <p>Aucune catégorie créée</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={20} />
            Créer une catégorie
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <button className="btn btn-icon" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {formError && (
                <div className="alert alert-error">{formError}</div>
              )}

              <div className="form-group">
                <label htmlFor="name">Nom de la catégorie</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alimentation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Icône</label>
                <div className="emoji-picker">
                  {suggestedEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className={`emoji-btn ${formData.icon === emoji ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Ou entrez un emoji"
                  maxLength={10}
                />
              </div>

              <div className="form-group">
                <label>Couleur</label>
                <div className="color-picker">
                  {suggestedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-btn ${formData.color === color ? 'active' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color: color })}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>

              <div className="category-preview">
                <span>Aperçu:</span>
                <div className="preview-badge" style={{ backgroundColor: formData.color }}>
                  {formData.icon} {formData.name || 'Catégorie'}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : (editingCategory ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
