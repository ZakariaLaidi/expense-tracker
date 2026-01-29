/**
 * Export centralisé des routes
 * Configure et exporte le routeur principal de l'API
 */

const express = require('express');
const authRoutes = require('./auth.routes');
const transactionRoutes = require('./transaction.routes');
const categoryRoutes = require('./category.routes');
const statsRoutes = require('./stats.routes');

const router = express.Router();

// Route de test de l'API
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Expense Tracker!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      transactions: '/api/transactions',
      categories: '/api/categories',
      stats: '/api/stats',
    },
  });
});

// Montage des routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
