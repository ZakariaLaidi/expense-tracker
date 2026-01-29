# 💰 Expense Tracker API

Une API REST robuste pour la gestion des finances personnelles, construite avec **Node.js**, **Express**, et **Prisma ORM**.

## 🚀 Fonctionnalités

- ✅ **Authentification JWT** - Inscription et connexion sécurisées
- ✅ **Gestion des transactions** - CRUD complet pour les dépenses et revenus
- ✅ **Catégorisation** - Organisation des transactions par catégorie
- ✅ **Statistiques** - Agrégation des données pour les graphiques
- ✅ **Filtrage** - Recherche par mois, type, catégorie
- ✅ **Déploiement Vercel** - Configuration prête pour le déploiement

## 📁 Structure du projet

```
expense-tracker/
├── prisma/
│   └── schema.prisma          # Schéma de la base de données
├── src/
│   ├── config/
│   │   ├── database.js        # Configuration Prisma Client
│   │   └── index.js           # Configuration centralisée
│   ├── controllers/
│   │   ├── auth.controller.js       # Authentification
│   │   ├── transaction.controller.js # Transactions
│   │   ├── category.controller.js   # Catégories
│   │   ├── stats.controller.js      # Statistiques
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.middleware.js       # Vérification JWT
│   │   ├── error.middleware.js      # Gestion des erreurs
│   │   └── index.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── category.routes.js
│   │   ├── stats.routes.js
│   │   └── index.js
│   └── index.js               # Point d'entrée
├── .env.example               # Variables d'environnement
├── package.json
├── vercel.json                # Configuration Vercel
└── README.md
```

## 🛠️ Installation

### 1. Cloner et installer les dépendances

```bash
cd expense-tracker
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/expense_tracker"
JWT_SECRET="votre_cle_secrete_super_securisee"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables (migration)
npx prisma migrate dev --name init

# (Optionnel) Ouvrir Prisma Studio
npx prisma studio
```

### 4. Démarrer le serveur

```bash
# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

## 📚 Endpoints API

### Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/register` | Inscription | ❌ |
| POST | `/login` | Connexion | ❌ |
| GET | `/me` | Profil utilisateur | ✅ |

### Transactions (`/api/transactions`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des transactions | ✅ |
| GET | `/:id` | Détail d'une transaction | ✅ |
| POST | `/` | Créer une transaction | ✅ |
| PUT | `/:id` | Modifier une transaction | ✅ |
| DELETE | `/:id` | Supprimer une transaction | ✅ |

**Query params pour GET `/`:**
- `month` - Filtrer par mois (format: YYYY-MM)
- `type` - Filtrer par type (EXPENSE/INCOME)
- `categoryId` - Filtrer par catégorie
- `limit` - Nombre de résultats (défaut: 50)
- `offset` - Décalage pour pagination

### Catégories (`/api/categories`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/` | Liste des catégories | ✅ |
| POST | `/` | Créer une catégorie | ✅ |
| PUT | `/:id` | Modifier une catégorie | ✅ |
| DELETE | `/:id` | Supprimer une catégorie | ✅ |

### Statistiques (`/api/stats`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/summary` | Résumé financier | ✅ |
| GET | `/by-category` | Répartition par catégorie | ✅ |
| GET | `/monthly` | Évolution mensuelle | ✅ |
| GET | `/recent` | Transactions récentes | ✅ |

## 📝 Exemples de requêtes

### Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Créer une transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 50.00,
    "description": "Courses au supermarché",
    "type": "EXPENSE",
    "categoryId": "CATEGORY_ID"
  }'
```

### Récupérer les statistiques par catégorie

```bash
curl -X GET "http://localhost:3000/api/stats/by-category?month=2026-01" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Déploiement sur Vercel

### 1. Configurer une base PostgreSQL

Utilisez un service comme:
- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [PlanetScale](https://planetscale.com/)

### 2. Configurer les secrets Vercel

```bash
vercel secrets add database_url "postgresql://..."
vercel secrets add jwt_secret "votre_secret"
vercel secrets add jwt_expires_in "7d"
```

### 3. Déployer

```bash
vercel --prod
```

## 🔧 Scripts disponibles

```bash
npm start           # Démarrer en production
npm run dev         # Démarrer en développement
npm run prisma:generate  # Générer le client Prisma
npm run prisma:migrate   # Exécuter les migrations
npm run prisma:studio    # Ouvrir Prisma Studio
```

## 📄 Modèles de données

### User
- `id` - Identifiant unique
- `name` - Nom de l'utilisateur
- `email` - Email (unique)
- `password` - Mot de passe haché
- `createdAt` - Date de création

### Category
- `id` - Identifiant unique
- `name` - Nom de la catégorie
- `icon` - Emoji ou icône
- `color` - Couleur hexadécimale
- `userId` - Propriétaire

### Transaction
- `id` - Identifiant unique
- `amount` - Montant
- `description` - Description
- `date` - Date de la transaction
- `type` - EXPENSE ou INCOME
- `userId` - Propriétaire
- `categoryId` - Catégorie associée

## 📜 Licence

MIT

---

Développé avec ❤️ pour le projet Expense Tracker
