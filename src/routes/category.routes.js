/**
 * Routes des catégories
 * Gère les opérations CRUD sur les catégories
 */

const express = require('express');
const { body } = require('express-validator');
const { categoryController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Toutes les routes de catégories nécessitent une authentification
router.use(authMiddleware);

/**
 * @route   GET /api/categories
 * @desc    Récupérer toutes les catégories de l'utilisateur
 * @access  Private
 */
router.get('/', categoryController.getCategories);

/**
 * @route   POST /api/categories
 * @desc    Créer une nouvelle catégorie
 * @access  Private
 */
router.post(
  '/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Le nom de la catégorie est requis.')
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères.'),
    body('icon')
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage('L\'icône ne peut pas dépasser 10 caractères.'),
    body('color')
      .optional()
      .trim()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('La couleur doit être au format hexadécimal (ex: #FF6B6B).'),
  ],
  categoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Mettre à jour une catégorie
 * @access  Private
 */
router.put(
  '/:id',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères.'),
    body('icon')
      .optional()
      .trim()
      .isLength({ max: 10 })
      .withMessage('L\'icône ne peut pas dépasser 10 caractères.'),
    body('color')
      .optional()
      .trim()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage('La couleur doit être au format hexadécimal (ex: #FF6B6B).'),
  ],
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Supprimer une catégorie
 * @access  Private
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
