# Porotein - Application de Suivi d'Entraînement

Porotein est une application complète de suivi d'entraînement qui permet aux utilisateurs de gérer leurs programmes d'entraînement, suivre leurs sessions, enregistrer leurs exercices et surveiller leur progression.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Contribution](#contribution)

## 🔍 Vue d'ensemble

Porotein est une application full-stack composée de deux parties principales :
- **API Backend** : Une API RESTful construite avec Node.js, Express et MongoDB
- **Frontend** : Une application web réactive construite avec React et TypeScript

L'application permet aux utilisateurs de :
- Créer et gérer des programmes d'entraînement
- Enregistrer et suivre des sessions d'entraînement
- Gérer une bibliothèque d'exercices
- Suivre leur progression (poids, mesures, performances)
- Visualiser des statistiques sur leurs performances

## 🏗️ Architecture

Le projet est organisé en deux parties principales :

### Backend (dossier `/api`)

- Framework : Express.js
- Langage : TypeScript
- Base de données : MongoDB avec Mongoose
- Architecture : MVC (Modèle-Vue-Contrôleur)

### Frontend (dossier `/app`)

- Framework : React
- Langage : TypeScript
- Gestion d'état : React Context et React Query
- Styles : SCSS Modules
- Routage : React Router

## 🚀 Installation

### Prérequis

- Node.js (v14+)
- pnpm
- MongoDB

### Étapes d'installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/porotein.git
   cd porotein
   ```

2. Installer les dépendances :
   ```bash
   pnpm install
   ```

3. Configurer les variables d'environnement :
   - Copier `.env.example` vers `.env.local` dans le dossier racine
   - Copier `.env.example` vers `.env.local` dans le dossier `/app`
   - Copier `.env.example` vers `.env` dans le dossier `/api`
   - Modifier les variables selon votre environnement

4. Démarrer l'application en mode développement :
   ```bash
   pnpm dev
   ```

## 💻 Utilisation

Une fois l'application démarrée, vous pouvez y accéder via :
- Frontend : http://localhost:5173
- API : http://localhost:4000

### Fonctionnalités principales

1. **Authentification**
   - Inscription et connexion
   - Gestion des tokens JWT

2. **Gestion des programmes**
   - Création et modification de programmes d'entraînement
   - Assignation de sessions à des programmes

3. **Sessions d'entraînement**
   - Création de sessions personnalisées
   - Suivi des sessions en temps réel
   - Historique des sessions

4. **Exercices**
   - Bibliothèque d'exercices
   - Catégorisation par muscles et tags
   - Suivi des performances par exercice

5. **Profil et statistiques**
   - Suivi du poids et des mesures
   - Visualisation des progrès
   - Statistiques de performance

## 📚 API Documentation

L'API est organisée selon les principes RESTful et expose les endpoints suivants :

### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion d'un utilisateur
- `POST /auth/refresh-token` - Rafraîchissement du token d'accès

### Utilisateurs
- `GET /users/me` - Récupérer l'utilisateur courant
- `PUT /users/me` - Mettre à jour l'utilisateur courant
- `GET /users` - Récupérer tous les utilisateurs (admin)
- `GET /users/:id` - Récupérer un utilisateur spécifique
- `PUT /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### Programmes
- `GET /programs` - Récupérer tous les programmes
- `POST /programs` - Créer un nouveau programme
- `GET /programs/:id` - Récupérer un programme spécifique
- `PUT /programs/:id` - Mettre à jour un programme
- `DELETE /programs/:id` - Supprimer un programme

### Sessions
- `GET /sessions` - Récupérer toutes les sessions
- `POST /sessions` - Créer une nouvelle session
- `GET /sessions/:id` - Récupérer une session spécifique
- `PUT /sessions/:id` - Mettre à jour une session
- `DELETE /sessions/:id` - Supprimer une session

### Exercices
- `GET /exercises` - Récupérer tous les exercices
- `POST /exercises` - Créer un nouvel exercice
- `GET /exercises/:id` - Récupérer un exercice spécifique
- `PUT /exercises/:id` - Mettre à jour un exercice
- `DELETE /exercises/:id` - Supprimer un exercice

### Poids et mesures
- `GET /api/weight` - Récupérer l'historique des poids
- `POST /api/weight` - Ajouter une entrée de poids
- `PUT /api/weight/:id` - Mettre à jour une entrée de poids
- `DELETE /api/weight/:id` - Supprimer une entrée de poids

## 🖥️ Frontend Documentation

Le frontend est organisé en composants réutilisables et utilise une architecture basée sur les fonctionnalités.

### Structure des dossiers

- `/src/components` - Composants réutilisables
- `/src/pages` - Pages de l'application
- `/src/context` - Contextes React pour la gestion d'état global
- `/src/hooks` - Hooks personnalisés
- `/src/services` - Services pour les appels API
- `/src/utils` - Fonctions utilitaires
- `/src/routes` - Configuration des routes
- `/src/styles` - Styles globaux et variables

### Composants principaux

- `BottomNav` - Navigation principale de l'application
- `ProgramSelector` - Sélection de programmes
- `Sessions` - Composants liés aux sessions d'entraînement
- `Statistics` - Visualisation des statistiques
- `Modal` - Fenêtre modale réutilisable
- `TagSelector` - Sélection de tags pour les exercices
- `Timer` - Chronomètre pour les exercices
- `RepSetInputs` - Saisie des répétitions et séries

### Contextes

- `AuthContext` - Gestion de l'authentification et de l'utilisateur

### Services

- `apiService` - Service de base pour les appels API avec gestion des tokens
- `authService` - Service d'authentification
- `userService` - Service de gestion des utilisateurs
- `programService` - Service de gestion des programmes
- `sessionService` - Service de gestion des sessions
- `exerciseService` - Service de gestion des exercices

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

Développé avec ❤️ par l'équipe Porotein 