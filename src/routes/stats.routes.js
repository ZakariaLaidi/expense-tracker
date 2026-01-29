/**
 * Routes des statistiques
 * Fournit les endpoints pour les données agrégées et les graphiques
 */

const express = require('express');
const { statsController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Toutes les routes de statistiques nécessitent une authentification
router.use(authMiddleware);

/**
 * @route   GET /api/stats/summary
 * @desc    Récupérer le résumé des finances (total dépenses, revenus, balance)
 * @access  Private
 * @query   month (YYYY-MM), year (YYYY)
 */
router.get('/summary', statsController.getSummary);

/**
 * @route   GET /api/stats/by-category
 * @desc    Récupérer les montants agrégés par catégorie
 * @access  Private
 * @query   month (YYYY-MM), year (YYYY), type (EXPENSE/INCOME)
 */
router.get('/by-category', statsController.getByCategory);

/**
 * @route   GET /api/stats/monthly
 * @desc    Récupérer l'évolution mensuelle des finances
 * @access  Private
 * @query   year (YYYY), months (nombre de mois, défaut: 12)
 */
router.get('/monthly', statsController.getMonthlyEvolution);

/**
 * @route   GET /api/stats/recent
 * @desc    Récupérer les transactions les plus récentes
 * @access  Private
 * @query   limit (nombre de transactions, défaut: 5)
 */
router.get('/recent', statsController.getRecentTransactions);

module.exports = router;
