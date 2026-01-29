/**
 * Contrôleur des transactions
 * Gère les opérations CRUD sur les transactions (dépenses et revenus)
 */

const { validationResult } = require('express-validator');
const prisma = require('../config/database');

/**
 * Récupérer toutes les transactions de l'utilisateur
 * GET /api/transactions
 * Query params: month (YYYY-MM), type (EXPENSE/INCOME), categoryId, limit, offset
 */
const getTransactions = async (req, res, next) => {
  try {
    const { month, type, categoryId, limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;
    
    // Construction du filtre
    const where = { userId };
    
    // Filtre par mois (format: YYYY-MM)
    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
      
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    
    // Filtre par type (EXPENSE ou INCOME)
    if (type && ['EXPENSE', 'INCOME'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }
    
    // Filtre par catégorie
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // Récupération des transactions avec pagination
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              icon: true,
              color: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      }),
      prisma.transaction.count({ where }),
    ]);
    
    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + transactions.length < total,
        },
      },
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer une transaction par son ID
 * GET /api/transactions/:id
 */
const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId, // S'assurer que la transaction appartient à l'utilisateur
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction non trouvée.',
      });
    }
    
    res.json({
      success: true,
      data: transaction,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle transaction
 * POST /api/transactions
 */
const createTransaction = async (req, res, next) => {
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
    
    const { amount, description, date, type, categoryId, isRecurring, recurrence } = req.body;
    const userId = req.user.id;
    
    // Vérification que la catégorie appartient à l'utilisateur
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie non trouvée ou non autorisée.',
      });
    }
    
    // Validation de la récurrence
    const validRecurrences = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
    const finalRecurrence = isRecurring && validRecurrences.includes(recurrence) ? recurrence : null;
    
    // Création de la transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: date ? new Date(date) : new Date(),
        type: type.toUpperCase(),
        userId,
        categoryId,
        isRecurring: Boolean(isRecurring),
        recurrence: finalRecurrence,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });
    
    res.status(201).json({
      success: true,
      message: 'Transaction créée avec succès.',
      data: transaction,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Mettre à jour une transaction
 * PUT /api/transactions/:id
 */
const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, description, date, type, categoryId } = req.body;
    const userId = req.user.id;
    
    // Vérification que la transaction existe et appartient à l'utilisateur
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    
    if (!existingTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction non trouvée.',
      });
    }
    
    // Si une nouvelle catégorie est fournie, vérifier qu'elle appartient à l'utilisateur
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: categoryId, userId },
      });
      
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Catégorie non trouvée ou non autorisée.',
        });
      }
    }
    
    // Mise à jour de la transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(description !== undefined && { description }),
        ...(date && { date: new Date(date) }),
        ...(type && { type: type.toUpperCase() }),
        ...(categoryId && { categoryId }),
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });
    
    res.json({
      success: true,
      message: 'Transaction mise à jour avec succès.',
      data: transaction,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une transaction
 * DELETE /api/transactions/:id
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Vérification que la transaction existe et appartient à l'utilisateur
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
    });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction non trouvée.',
      });
    }
    
    // Suppression de la transaction
    await prisma.transaction.delete({
      where: { id },
    });
    
    res.json({
      success: true,
      message: 'Transaction supprimée avec succès.',
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
