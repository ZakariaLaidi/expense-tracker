/**
 * Routes d'authentification
 * Gère l'inscription, la connexion et le profil utilisateur
 */

const express = require('express');
const { body } = require('express-validator');
const { authController } = require('../controllers');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Le nom est requis.')
      .isLength({ min: 2, max: 50 })
      .withMessage('Le nom doit contenir entre 2 et 50 caractères.'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('L\'email est requis.')
      .isEmail()
      .withMessage('Veuillez fournir un email valide.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Le mot de passe est requis.')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  ],
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('L\'email est requis.')
      .isEmail()
      .withMessage('Veuillez fournir un email valide.')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Le mot de passe est requis.'),
  ],
  authController.login
);

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @access  Private (Token requis)
 */
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
