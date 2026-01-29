/**
 * Middleware d'authentification JWT
 * Vérifie la validité du token et extrait les informations utilisateur
 */

const jwt = require('jsonwebtoken');
const config = require('../config');
const prisma = require('../config/database');

/**
 * Middleware pour protéger les routes nécessitant une authentification
 * Vérifie le token JWT dans le header Authorization
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Récupération du token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Accès non autorisé. Token manquant.',
      });
    }
    
    // Extraction du token (format: "Bearer <token>")
    const token = authHeader.split(' ')[1];
    
    // Vérification et décodage du token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Récupération de l'utilisateur depuis la base de données
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé.',
      });
    }
    
    // Ajout des informations utilisateur à la requête
    req.user = user;
    next();
    
  } catch (error) {
    // Gestion des erreurs JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré. Veuillez vous reconnecter.',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'authentification.',
    });
  }
};

module.exports = authMiddleware;
