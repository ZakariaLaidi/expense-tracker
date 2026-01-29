/**
 * Routes des transactions
 * Gère les opérations CRUD sur les transactions
 */

const express = require('express');
const { body } = require('express-validator');
const { transactionController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Toutes les routes de transactions nécessitent une authentification
router.use(authMiddleware);

/**
 * @route   GET /api/transactions
 * @desc    Récupérer toutes les transactions de l'utilisateur
 * @access  Private
 * @query   month (YYYY-MM), type (EXPENSE/INCOME), categoryId, limit, offset
 */
router.get('/', transactionController.getTransactions);

/**
 * @route   GET /api/transactions/:id
 * @desc    Récupérer une transaction par son ID
 * @access  Private
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @route   POST /api/transactions
 * @desc    Créer une nouvelle transaction
 * @access  Private
 */
router.post(
  '/',
  [
    body('amount')
      .notEmpty()
      .withMessage('Le montant est requis.')
      .isFloat({ min: 0.01 })
      .withMessage('Le montant doit être un nombre positif.'),
    body('type')
      .notEmpty()
      .withMessage('Le type est requis.')
      .isIn(['EXPENSE', 'INCOME', 'expense', 'income'])
      .withMessage('Le type doit être EXPENSE ou INCOME.'),
    body('categoryId')
      .notEmpty()
      .withMessage('La catégorie est requise.')
      .isString()
      .withMessage('L\'ID de catégorie doit être une chaîne de caractères.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La description ne peut pas dépasser 255 caractères.'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('La date doit être au format ISO 8601.'),
  ],
  transactionController.createTransaction
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Mettre à jour une transaction
 * @access  Private
 */
router.put(
  '/:id',
  [
    body('amount')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Le montant doit être un nombre positif.'),
    body('type')
      .optional()
      .isIn(['EXPENSE', 'INCOME', 'expense', 'income'])
      .withMessage('Le type doit être EXPENSE ou INCOME.'),
    body('categoryId')
      .optional()
      .isString()
      .withMessage('L\'ID de catégorie doit être une chaîne de caractères.'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 255 })
      .withMessage('La description ne peut pas dépasser 255 caractères.'),
    body('date')
      .optional()
      .isISO8601()
      .withMessage('La date doit être au format ISO 8601.'),
  ],
  transactionController.updateTransaction
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Supprimer une transaction
 * @access  Private
 */
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
