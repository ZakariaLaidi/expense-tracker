/**
 * Configuration centralisée de l'application
 * Charge les variables d'environnement et exporte les configurations
 */

require('dotenv').config();

module.exports = {
  // Configuration du serveur
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Configuration CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};
