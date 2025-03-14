# Guide de contribution - Porotein

Merci de votre intérêt pour contribuer au projet Porotein ! Ce document vous guidera à travers le processus de contribution.

## Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment puis-je contribuer ?](#comment-puis-je-contribuer)
  - [Signaler des bugs](#signaler-des-bugs)
  - [Suggérer des améliorations](#suggérer-des-améliorations)
  - [Contribuer au code](#contribuer-au-code)
- [Style de code](#style-de-code)
- [Processus de développement](#processus-de-développement)
  - [Branches](#branches)
  - [Commits](#commits)
  - [Pull Requests](#pull-requests)
- [Environnement de développement](#environnement-de-développement)

## Code de conduite

Ce projet et tous ses participants sont régis par un code de conduite qui favorise un environnement ouvert et accueillant. En participant, vous êtes tenu de respecter ce code.

## Comment puis-je contribuer ?

### Signaler des bugs

Les bugs sont suivis via les issues GitHub. Avant de créer une issue pour un bug, veuillez vérifier que le bug n'a pas déjà été signalé.

Lorsque vous créez une issue pour un bug, incluez :
- Un titre clair et descriptif
- Les étapes précises pour reproduire le problème
- Le comportement attendu et ce qui se passe réellement
- Des captures d'écran si possible
- Votre environnement (navigateur, système d'exploitation, etc.)

### Suggérer des améliorations

Les suggestions d'amélioration sont également suivies via les issues GitHub. Avant de créer une issue pour une suggestion, veuillez vérifier qu'une suggestion similaire n'a pas déjà été faite.

Lorsque vous créez une issue pour une suggestion, incluez :
- Un titre clair et descriptif
- Une description détaillée de l'amélioration proposée
- Les avantages que cette amélioration apporterait
- Des exemples ou maquettes si possible

### Contribuer au code

1. Forker le dépôt
2. Cloner votre fork localement
3. Créer une branche pour votre contribution
4. Faire vos modifications
5. Exécuter les tests (si disponibles)
6. Pousser vos modifications vers votre fork
7. Créer une Pull Request

## Style de code

Nous utilisons ESLint et Prettier pour maintenir un style de code cohérent. Veuillez vous assurer que votre code respecte ces règles avant de soumettre une Pull Request.

### Backend (API)

- Utilisez TypeScript pour tout le code
- Suivez les principes SOLID
- Documentez les fonctions et les classes avec des commentaires JSDoc
- Utilisez des noms de variables et de fonctions descriptifs
- Gérez correctement les erreurs

### Frontend (App)

- Utilisez des composants fonctionnels avec des hooks
- Utilisez TypeScript pour tout le code
- Suivez les principes de conception des composants React
- Utilisez des modules SCSS pour les styles
- Testez vos composants (si possible)

## Processus de développement

### Branches

- `main` : Branche principale, contient le code de production
- `develop` : Branche de développement, contient les fonctionnalités en cours de développement
- `feature/nom-de-la-fonctionnalité` : Branches pour les nouvelles fonctionnalités
- `bugfix/nom-du-bug` : Branches pour les corrections de bugs

### Commits

Utilisez des messages de commit clairs et descriptifs. Nous recommandons de suivre le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description courte

Description détaillée si nécessaire
```

Types courants :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Modification de la documentation
- `style` : Modifications de style (formatage, espaces, etc.)
- `refactor` : Refactoring du code
- `test` : Ajout ou modification de tests
- `chore` : Tâches de maintenance

### Pull Requests

- Créez une Pull Request depuis votre branche vers la branche `develop`
- Incluez une description claire de vos modifications
- Référencez les issues pertinentes
- Assurez-vous que tous les tests passent
- Demandez une revue de code

## Environnement de développement

### Prérequis

- Node.js (v14+)
- pnpm
- MongoDB

### Installation

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

### Structure du projet

```
/
  /api          # Backend API
  /app          # Frontend application
  /scripts      # Scripts utilitaires
  /utils        # Utilitaires partagés
```

---

Merci de contribuer à Porotein ! Votre aide est précieuse pour améliorer ce projet. 