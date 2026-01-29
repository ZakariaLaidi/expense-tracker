/**
 * Contrôleur des catégories
 * Gère les opérations CRUD sur les catégories
 */

const { validationResult } = require('express-validator');
const prisma = require('../config/database');

/**
 * Récupérer toutes les catégories de l'utilisateur
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const categories = await prisma.category.findMany({
      where: { userId },
      include: {
        _count: {
          select: { transactions: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    
    res.json({
      success: true,
      data: categories,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle catégorie
 * POST /api/categories
 */
const createCategory = async (req, res, next) => {
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
    
    const { name, icon, color } = req.body;
    const userId = req.user.id;
    
    // Vérification si la catégorie existe déjà pour cet utilisateur
    const existingCategory = await prisma.category.findFirst({
      where: { name, userId },
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Une catégorie avec ce nom existe déjà.',
      });
    }
    
    // Création de la catégorie
    const category = await prisma.category.create({
      data: {
        name,
        icon,
        color,
        userId,
      },
    });
    
    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès.',
      data: category,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une catégorie
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, color } = req.body;
    const userId = req.user.id;
    
    // Vérification que la catégorie existe et appartient à l'utilisateur
    const existingCategory = await prisma.category.findFirst({
      where: { id, userId },
    });
    
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée.',
      });
    }
    
    // Vérification si le nouveau nom existe déjà
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: { name, userId },
      });
      
      if (duplicateCategory) {
        return res.status(400).json({
          success: false,
          message: 'Une catégorie avec ce nom existe déjà.',
        });
      }
    }
    
    // Mise à jour de la catégorie
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(icon !== undefined && { icon }),
        ...(color !== undefined && { color }),
      },
    });
    
    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès.',
      data: category,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une catégorie
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Vérification que la catégorie existe et appartient à l'utilisateur
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée.',
      });
    }
    
    // Vérification si des transactions utilisent cette catégorie
    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    });
    
    if (transactionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer cette catégorie. Elle est utilisée par ${transactionCount} transaction(s).`,
      });
    }
    
    // Suppression de la catégorie
    await prisma.category.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès.',
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
