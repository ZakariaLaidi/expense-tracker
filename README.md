# ExpenseTracker

Application web complète de gestion des finances personnelles permettant de suivre ses dépenses et revenus au quotidien.

![ExpenseTracker](https://img.shields.io/badge/Version-1.0.0-4ECDC4?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## Description

**ExpenseTracker** est une application de suivi budgétaire intuitive qui vous aide à prendre le contrôle de vos finances. Visualisez vos dépenses, catégorisez vos transactions et analysez vos habitudes financières grâce à des graphiques interactifs.

## Fonctionnalités

### Authentification
L'application dispose d'un système d'authentification complet et sécurisé. Les utilisateurs peuvent créer un compte en s'inscrivant avec leur nom, email et mot de passe. La connexion est gérée via des tokens JWT (JSON Web Tokens) qui garantissent la sécurité des sessions. Toutes les routes sensibles sont protégées et les données personnelles de chaque utilisateur sont isolées et inaccessibles aux autres.

### Gestion des Transactions
Le cœur de l'application permet d'enregistrer toutes vos opérations financières. Vous pouvez ajouter des dépenses ou des revenus en spécifiant le montant, une description, la date et la catégorie associée. Chaque transaction peut être modifiée ou supprimée à tout moment. Un système de filtrage avancé vous permet de rechercher vos transactions par plage de dates, par type (dépense ou revenu) ou par catégorie. L'application supporte également les transactions récurrentes pour automatiser l'enregistrement des dépenses régulières comme le loyer ou les abonnements.

### Catégories Personnalisées
Pour mieux organiser vos finances, vous pouvez créer vos propres catégories de dépenses et revenus. Chaque catégorie peut être personnalisée avec une icône emoji et une couleur de votre choix. Cette flexibilité vous permet d'adapter l'application à votre mode de vie et d'avoir une vue claire de la répartition de vos dépenses par domaine (alimentation, transport, loisirs, etc.).

### Tableau de Bord Finances
Le tableau de bord offre une vue d'ensemble de votre situation financière. En haut de page, vous trouvez un résumé avec votre solde actuel, le total des revenus et le total des dépenses. Un graphique en camembert illustre la répartition de vos dépenses par catégorie, permettant d'identifier rapidement où va votre argent. Un graphique linéaire affiche l'évolution de vos finances sur les derniers mois. Enfin, une liste des transactions récentes vous donne un aperçu de vos dernières opérations.

### Mode Sombre
L'application propose un mode sombre pour un confort visuel optimal, particulièrement utile lors d'une utilisation nocturne. Un simple clic sur l'icône lune/soleil dans la barre de navigation permet de basculer entre le thème clair et le thème sombre. Votre préférence est automatiquement sauvegardée dans le navigateur et sera conservée lors de vos prochaines visites.

### Interface Responsive
L'interface a été conçue pour s'adapter parfaitement à tous les types d'écrans. Que vous utilisiez l'application sur un ordinateur de bureau, une tablette ou un smartphone, l'expérience utilisateur reste fluide et intuitive. La barre de navigation se réorganise automatiquement sur mobile pour optimiser l'espace disponible tout en gardant toutes les fonctionnalités accessibles.

## Technologies Utilisées

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

## Structure du Projet

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

## Liens

- **Frontend** : [expense-tracker-pbdq.vercel.app](https://expense-tracker-pbdq.vercel.app)
- **Backend API** : [expense-tracker-livid-six-89.vercel.app](https://expense-tracker-livid-six-89.vercel.app)

## Auteur

Développé par **Zakaria Laidi**