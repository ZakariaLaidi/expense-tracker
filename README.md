# 💰 ExpenseTracker

Application web complète de gestion des finances personnelles permettant de suivre ses dépenses et revenus au quotidien.

![ExpenseTracker](https://img.shields.io/badge/Version-1.0.0-4ECDC4?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## 📝 Description

**ExpenseTracker** est une application de suivi budgétaire intuitive qui vous aide à prendre le contrôle de vos finances. Visualisez vos dépenses, catégorisez vos transactions et analysez vos habitudes financières grâce à des graphiques interactifs.

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisées avec JWT
- Protection des routes et données personnelles

### 💳 Gestion des Transactions
- Ajout de dépenses et revenus
- Modification et suppression des transactions
- Filtrage par date, type et catégorie
- Support des transactions récurrentes

### 📂 Catégories Personnalisées
- Création de catégories avec icônes emoji
- Couleurs personnalisables
- Organisation flexible des dépenses

### 📊 Tableau de Bord (Finances)
- Résumé financier (solde, revenus, dépenses)
- Graphique en camembert par catégorie
- Graphique d'évolution mensuelle
- Liste des transactions récentes

### 🌙 Mode Sombre
- Thème clair / sombre
- Préférence sauvegardée automatiquement

### 📱 Responsive
- Interface adaptée mobile, tablette et desktop

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma ORM** - Gestion de base de données
- **PostgreSQL** - Base de données (Supabase)
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hashage des mots de passe

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool rapide
- **React Router DOM** - Navigation SPA
- **Axios** - Requêtes HTTP
- **Recharts** - Graphiques interactifs
- **Lucide React** - Icônes modernes

### Déploiement
- **Vercel** - Hébergement backend et frontend
- **Supabase** - Base de données PostgreSQL cloud

## 📁 Structure du Projet

```
expense-tracker/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # Contextes React
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/          # Services API
│   │   │   └── api.js
│   │   ├── config/            # Configuration
│   │   ├── App.jsx            # Composant principal
│   │   └── App.css            # Styles globaux
│   └── index.html
│
├── src/                       # Backend Express
│   ├── config/                # Configuration
│   │   ├── database.js
│   │   └── index.js
│   ├── controllers/           # Logique métier
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   ├── category.controller.js
│   │   └── stats.controller.js
│   ├── middlewares/           # Middlewares
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── routes/                # Routes API
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── category.routes.js
│   │   └── stats.routes.js
│   └── index.js               # Point d'entrée
│
├── prisma/
│   └── schema.prisma          # Schéma de base de données
│
├── vercel.json                # Configuration Vercel
└── package.json
```

## 🚀 Liens

- **Frontend** : [expense-tracker-pbdq.vercel.app](https://expense-tracker-pbdq.vercel.app)
- **Backend API** : [expense-tracker-livid-six-89.vercel.app](https://expense-tracker-livid-six-89.vercel.app)

## 👤 Auteur

Développé par **Zakaria Laidi**

---

*Projet réalisé avec ❤️*
