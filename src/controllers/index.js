/**
 * Export centralisé des contrôleurs
 */

const authController = require('./auth.controller');
const transactionController = require('./transaction.controller');
const categoryController = require('./category.controller');
const statsController = require('./stats.controller');

module.exports = {
  authController,
  transactionController,
  categoryController,
  statsController,
};
