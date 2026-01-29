/**
 * Export centralisé des middlewares
 */

const authMiddleware = require('./auth.middleware');
const { errorHandler, notFound } = require('./error.middleware');

module.exports = {
  authMiddleware,
  errorHandler,
  notFound,
};
