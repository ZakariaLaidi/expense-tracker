/**
 * Point d'entrée de l'application Expense Tracker
 * Configure et démarre le serveur Express
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares');

// Initialisation de l'application Express
const app = express();

// ============================================
// MIDDLEWARES GLOBAUX
// ============================================

// Liste des origines autorisées
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL, // URL du frontend en production
].filter(Boolean);

// Activation de CORS pour les requêtes cross-origin
app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (comme les appels API directs)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(null, true); // En production, autoriser toutes les origines pour simplifier
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsing du JSON dans le body des requêtes
app.use(express.json());

// Parsing des données URL-encoded
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Route de santé pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Expense Tracker opérationnelle',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Montage des routes de l'API
app.use('/api', routes);

// ============================================
// GESTION DES ERREURS
// ============================================

// Middleware pour les routes non trouvées (404)
app.use(notFound);

// Middleware de gestion des erreurs (doit être le dernier)
app.use(errorHandler);

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

// Ne démarre le serveur que si ce n'est pas un import (pour Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log('='.repeat(50));
    console.log('🚀 EXPENSE TRACKER API');
    console.log('='.repeat(50));
    console.log(`📡 Serveur démarré sur le port ${config.port}`);
    console.log(`🌍 Environnement: ${config.nodeEnv}`);
    console.log(`🔗 URL: http://localhost:${config.port}`);
    console.log(`📚 API: http://localhost:${config.port}/api`);
    console.log('='.repeat(50));
  });
}

// Export pour Vercel
module.exports = app;
