/**
 * Contrôleur des statistiques
 * Fournit des données agrégées pour les graphiques et analyses
 */

const prisma = require('../config/database');

/**
 * Récupérer le résumé des finances
 * GET /api/stats/summary
 * Query params: month (YYYY-MM), year (YYYY), startDate (YYYY-MM-DD), endDate (YYYY-MM-DD)
 */
const getSummary = async (req, res, next) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    const userId = req.user.id;
    
    // Construction du filtre de date
    let dateFilter = {};
    
    if (startDate || endDate) {
      // Filtre par plage de dates personnalisée
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.gte = new Date(startDate + 'T00:00:00.000Z');
      }
      if (endDate) {
        dateFilter.date.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    } else if (month) {
      // Filtre par mois spécifique (format: YYYY-MM)
      const [y, m] = month.split('-').map(Number);
      const startOfMonth = new Date(y, m - 1, 1);
      const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      };
    } else if (year) {
      // Filtre par année
      const y = parseInt(year);
      const startOfYear = new Date(y, 0, 1);
      const endOfYear = new Date(y, 11, 31, 23, 59, 59, 999);
      dateFilter = {
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      };
    }
    
    // Agrégation des dépenses et revenus
    const [expenses, incomes] = await Promise.all([
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'EXPENSE',
          ...dateFilter,
        },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.transaction.aggregate({
        where: {
          userId,
          type: 'INCOME',
          ...dateFilter,
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);
    
    const totalExpenses = expenses._sum.amount || 0;
    const totalIncomes = incomes._sum.amount || 0;
    const balance = totalIncomes - totalExpenses;
    
    res.json({
      success: true,
      data: {
        totalExpenses,
        totalIncomes,
        balance,
        transactionCount: {
          expenses: expenses._count,
          incomes: incomes._count,
          total: expenses._count + incomes._count,
        },
      },
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les dépenses par catégorie
 * GET /api/stats/by-category
 * Query params: month (YYYY-MM), year (YYYY), startDate, endDate, type (EXPENSE/INCOME)
 */
const getByCategory = async (req, res, next) => {
  try {
    const { month, year, startDate, endDate, type = 'EXPENSE' } = req.query;
    const userId = req.user.id;
    
    // Construction du filtre de date
    let dateFilter = {};
    
    if (startDate || endDate) {
      // Filtre par plage de dates personnalisée
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.gte = new Date(startDate + 'T00:00:00.000Z');
      }
      if (endDate) {
        dateFilter.date.lte = new Date(endDate + 'T23:59:59.999Z');
      }
    } else if (month) {
      const [y, m] = month.split('-').map(Number);
      const startOfMonth = new Date(y, m - 1, 1);
      const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);
      dateFilter = {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      };
    } else if (year) {
      const y = parseInt(year);
      const startOfYear = new Date(y, 0, 1);
      const endOfYear = new Date(y, 11, 31, 23, 59, 59, 999);
      dateFilter = {
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      };
    }
    
    // Agrégation par catégorie avec GROUP BY
    const categoryStats = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: type.toUpperCase(),
        ...dateFilter,
      },
      _sum: { amount: true },
      _count: true,
    });
    
    // Récupération des informations des catégories
    const categoryIds = categoryStats.map(stat => stat.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
      },
    });
    
    // Fusion des données
    const result = categoryStats.map(stat => {
      const category = categories.find(c => c.id === stat.categoryId);
      return {
        category,
        total: stat._sum.amount || 0,
        count: stat._count,
      };
    });
    
    // Tri par montant décroissant
    result.sort((a, b) => b.total - a.total);
    
    // Calcul du total pour les pourcentages
    const grandTotal = result.reduce((sum, item) => sum + item.total, 0);
    
    // Ajout des pourcentages
    const resultWithPercentage = result.map(item => ({
      ...item,
      percentage: grandTotal > 0 ? Math.round((item.total / grandTotal) * 100 * 100) / 100 : 0,
    }));
    
    res.json({
      success: true,
      data: {
        stats: resultWithPercentage,
        grandTotal,
      },
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'évolution mensuelle
 * GET /api/stats/monthly
 * Query params: year (YYYY), months (nombre de mois à récupérer, défaut: 12)
 */
const getMonthlyEvolution = async (req, res, next) => {
  try {
    const { year, months = 12 } = req.query;
    const userId = req.user.id;
    
    // Déterminer la plage de dates
    const currentDate = new Date();
    let startDate, endDate;
    
    if (year) {
      const y = parseInt(year);
      startDate = new Date(y, 0, 1);
      endDate = new Date(y, 11, 31, 23, 59, 59, 999);
    } else {
      // Par défaut, les X derniers mois
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - parseInt(months) + 1, 1);
    }
    
    // Récupération de toutes les transactions dans la période
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        date: true,
        type: true,
      },
    });
    
    // Agrégation par mois
    const monthlyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[key]) {
        monthlyData[key] = {
          month: key,
          expenses: 0,
          incomes: 0,
          balance: 0,
        };
      }
      
      if (transaction.type === 'EXPENSE') {
        monthlyData[key].expenses += transaction.amount;
      } else {
        monthlyData[key].incomes += transaction.amount;
      }
    });
    
    // Calcul du balance et formatage
    const result = Object.values(monthlyData)
      .map(item => ({
        ...item,
        balance: item.incomes - item.expenses,
        expenses: Math.round(item.expenses * 100) / 100,
        incomes: Math.round(item.incomes * 100) / 100,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les transactions récentes
 * GET /api/stats/recent
 * Query params: limit (défaut: 5)
 */
const getRecentTransactions = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user.id;
    
    const transactions = await prisma.transaction.findMany({
      where: { userId },
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
    });
    
    res.json({
      success: true,
      data: transactions,
    });
    
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSummary,
  getByCategory,
  getMonthlyEvolution,
  getRecentTransactions,
};
