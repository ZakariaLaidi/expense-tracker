/**
 * Middleware de gestion des erreurs
 * Capture et formate les erreurs de l'application
 */

/**
 * Middleware de gestion centralisée des erreurs
 * @param {Error} err - L'erreur capturée
 * @param {Request} req - L'objet requête Express
 * @param {Response} res - L'objet réponse Express
 * @param {NextFunction} next - Fonction next d'Express
 */
const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);
  
  // Erreur de validation Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Une entrée avec ces données existe déjà.',
      field: err.meta?.target?.[0],
    });
  }
  
  // Erreur de contrainte de clé étrangère Prisma
  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide. L\'élément lié n\'existe pas.',
    });
  }
  
  // Erreur d'enregistrement non trouvé Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Enregistrement non trouvé.',
    });
  }
  
  // Erreur de validation express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation.',
      errors: err.array(),
    });
  }
  
  // Erreur générique
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur.';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Middleware pour les routes non trouvées
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée.`,
  });
};

module.exports = {
  errorHandler,
  notFound,
};
