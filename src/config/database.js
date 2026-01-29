/**
 * Configuration de la base de données avec Prisma Client
 * Singleton pattern pour éviter les connexions multiples en développement
 */

const { PrismaClient } = require('@prisma/client');

// Création d'une instance unique de PrismaClient
// En développement, on stocke l'instance dans globalThis pour éviter
// les connexions multiples lors du hot-reload
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Stockage de l'instance en développement
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
