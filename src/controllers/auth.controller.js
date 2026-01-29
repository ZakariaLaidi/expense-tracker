/**
 * Contrôleur d'authentification
 * Gère l'inscription et la connexion des utilisateurs
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../config/database');
const config = require('../config');

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    // Validation des données entrantes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation.',
        errors: errors.array(),
      });
    }
    
    const { name, email, password } = req.body;
    
    // Vérification si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }
    
    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    // Création des catégories par défaut pour le nouvel utilisateur
    const defaultCategories = [
      { name: 'Alimentation', icon: '🍔', color: '#FF6B6B' },
      { name: 'Transport', icon: '🚗', color: '#4ECDC4' },
      { name: 'Logement', icon: '🏠', color: '#45B7D1' },
      { name: 'Loisirs', icon: '🎮', color: '#96CEB4' },
      { name: 'Santé', icon: '💊', color: '#FFEAA7' },
      { name: 'Shopping', icon: '🛍️', color: '#DDA0DD' },
      { name: 'Salaire', icon: '💰', color: '#98D8C8' },
      { name: 'Autres', icon: '📦', color: '#B8B8B8' },
    ];
    
    await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId: user.id,
      })),
    });
    
    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie.',
      data: {
        user,
        token,
      },
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Connexion d'un utilisateur
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    // Validation des données entrantes
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Erreurs de validation.',
        errors: errors.array(),
      });
    }
    
    const { email, password } = req.body;
    
    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }
    
    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }
    
    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    res.json({
      success: true,
      message: 'Connexion réussie.',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Récupération du profil utilisateur connecté
 * GET /api/auth/me
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true,
            categories: true,
          },
        },
      },
    });
    
    res.json({
      success: true,
      data: user,
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
