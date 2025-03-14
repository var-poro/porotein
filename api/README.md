# API Porotein - Documentation Technique

Cette documentation détaille l'architecture, les endpoints et les modèles de données de l'API Porotein.

## Table des matières

- [Architecture](#architecture)
- [Configuration](#configuration)
- [Modèles de données](#modèles-de-données)
- [Endpoints API](#endpoints-api)
- [Authentification](#authentification)
- [Documentation Swagger](#documentation-swagger)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Déploiement](#déploiement)

## Architecture

L'API Porotein est construite selon l'architecture MVC (Modèle-Vue-Contrôleur) :

- **Modèles** (`/src/models`) : Définissent la structure des données et les interactions avec la base de données MongoDB via Mongoose.
- **Contrôleurs** (`/src/controllers`) : Contiennent la logique métier et gèrent les requêtes/réponses.
- **Routes** (`/src/routes`) : Définissent les endpoints de l'API et les associent aux contrôleurs.

Autres composants importants :
- **Middleware** (`/src/middleware`) : Fonctions intermédiaires pour l'authentification, la validation, etc.
- **Config** (`/src/config`) : Configuration de la base de données et autres paramètres.

## Configuration

### Variables d'environnement

L'API utilise les variables d'environnement suivantes (à définir dans le fichier `.env`) :

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/porotein
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d
```

### Base de données

La connexion à MongoDB est configurée dans `/src/config/database.ts`. L'application utilise Mongoose comme ORM.

## Modèles de données

### User

```typescript
interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  weightHistory: IWeightDetail[];
  measurementsHistory: IMeasurementDetail[];
  activeProgram: Schema.Types.ObjectId | typeof Program;
}
```

### Program

```typescript
interface IProgram extends Document {
  name: string;
  description: string;
  creator: Schema.Types.ObjectId;
  sessions: Schema.Types.ObjectId[];
}
```

### Session

```typescript
interface ISession extends Document {
  name: string;
  description: string;
  exercises: {
    exercise: Schema.Types.ObjectId;
    sets: number;
    reps: number;
  }[];
  creator: Schema.Types.ObjectId;
}
```

### Exercise

```typescript
interface IExercise extends Document {
  name: string;
  description: string;
  muscles: Schema.Types.ObjectId[];
  tags: Schema.Types.ObjectId[];
  creator: Schema.Types.ObjectId;
}
```

### SavedSession

```typescript
interface ISavedSession extends Document {
  session: Schema.Types.ObjectId;
  date: Date;
  exercises: {
    exercise: Schema.Types.ObjectId;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
  user: Schema.Types.ObjectId;
  duration: number;
  notes: string;
}
```

## Endpoints API

### Authentification

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| POST | `/auth/register` | Inscription | `{ username, email, password }` | `{ user, accessToken }` |
| POST | `/auth/login` | Connexion | `{ email, password }` | `{ user, accessToken }` |
| POST | `/auth/refresh-token` | Rafraîchir le token | `{ token }` | `{ accessToken }` |

### Utilisateurs

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/users/me` | Obtenir l'utilisateur courant | - | `User` |
| PUT | `/users/me` | Mettre à jour l'utilisateur courant | `User` | `User` |
| GET | `/users` | Obtenir tous les utilisateurs | - | `User[]` |
| GET | `/users/:id` | Obtenir un utilisateur | - | `User` |
| PUT | `/users/:id` | Mettre à jour un utilisateur | `User` | `User` |
| DELETE | `/users/:id` | Supprimer un utilisateur | - | `User` |

### Programmes

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/programs` | Obtenir tous les programmes | - | `Program[]` |
| POST | `/programs` | Créer un programme | `Program` | `Program` |
| GET | `/programs/:id` | Obtenir un programme | - | `Program` |
| PUT | `/programs/:id` | Mettre à jour un programme | `Program` | `Program` |
| DELETE | `/programs/:id` | Supprimer un programme | - | `Program` |

### Sessions

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/sessions` | Obtenir toutes les sessions | - | `Session[]` |
| POST | `/sessions` | Créer une session | `Session` | `Session` |
| GET | `/sessions/:id` | Obtenir une session | - | `Session` |
| PUT | `/sessions/:id` | Mettre à jour une session | `Session` | `Session` |
| DELETE | `/sessions/:id` | Supprimer une session | - | `Session` |

### Sessions enregistrées

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/saved-sessions` | Obtenir toutes les sessions enregistrées | - | `SavedSession[]` |
| POST | `/saved-sessions` | Créer une session enregistrée | `SavedSession` | `SavedSession` |
| GET | `/saved-sessions/:id` | Obtenir une session enregistrée | - | `SavedSession` |
| PUT | `/saved-sessions/:id` | Mettre à jour une session enregistrée | `SavedSession` | `SavedSession` |
| DELETE | `/saved-sessions/:id` | Supprimer une session enregistrée | - | `SavedSession` |

### Exercices

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/exercises` | Obtenir tous les exercices | - | `Exercise[]` |
| POST | `/exercises` | Créer un exercice | `Exercise` | `Exercise` |
| GET | `/exercises/:id` | Obtenir un exercice | - | `Exercise` |
| PUT | `/exercises/:id` | Mettre à jour un exercice | `Exercise` | `Exercise` |
| DELETE | `/exercises/:id` | Supprimer un exercice | - | `Exercise` |

### Poids

| Méthode | Endpoint | Description | Corps de la requête | Réponse |
|---------|----------|-------------|-------------------|---------|
| GET | `/api/weight` | Obtenir l'historique des poids | - | `WeightDetail[]` |
| POST | `/api/weight` | Ajouter une entrée de poids | `{ weight, date }` | `WeightDetail` |
| PUT | `/api/weight/:id` | Mettre à jour une entrée de poids | `{ weight, date }` | `WeightDetail` |
| DELETE | `/api/weight/:id` | Supprimer une entrée de poids | - | `{ message }` |

## Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification :

1. **Token d'accès** : Utilisé pour authentifier les requêtes, durée de vie courte (1 heure par défaut)
2. **Token de rafraîchissement** : Utilisé pour obtenir un nouveau token d'accès, durée de vie plus longue (7 jours par défaut)

### Middleware d'authentification

Le middleware d'authentification vérifie la présence et la validité du token JWT dans l'en-tête `Authorization` de la requête.

```typescript
// Exemple simplifié
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Accès refusé');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(401).send('Token invalide');
  }
};
```

## Documentation Swagger

L'API est documentée avec Swagger (OpenAPI), ce qui permet d'explorer et de tester les endpoints de manière interactive.

### Accès à la documentation Swagger

La documentation Swagger est accessible à l'URL suivante lorsque l'API est en cours d'exécution :

```
http://localhost:4000/api-docs
```

### Fonctionnalités de la documentation Swagger

- **Exploration interactive** : Parcourez tous les endpoints disponibles, regroupés par tags
- **Test des endpoints** : Testez directement les endpoints depuis l'interface Swagger
- **Modèles de données** : Visualisez la structure des modèles de données
- **Authentification** : Testez les endpoints sécurisés en fournissant un token JWT

### Structure de la documentation Swagger

La documentation Swagger est générée à partir des commentaires JSDoc dans les fichiers de routes. Chaque route est documentée avec :

- Une description
- Les paramètres de requête (path, query, body)
- Les réponses possibles
- Les schémas de données utilisés

### Exemple de documentation d'une route

```typescript
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 */
```

### Génération de la documentation

La documentation Swagger est générée automatiquement à partir des commentaires dans le code. La configuration se trouve dans le fichier `/src/config/swagger.ts`.

## Gestion des erreurs

L'API utilise un système de gestion d'erreurs standardisé :

- **400** : Erreur de validation ou requête incorrecte
- **401** : Non authentifié
- **403** : Non autorisé
- **404** : Ressource non trouvée
- **500** : Erreur serveur

Exemple de gestion d'erreur dans un contrôleur :

```typescript
try {
  // Logique métier
} catch (error) {
  res.status(500).send(error);
}
```

## Déploiement

L'API peut être déployée avec PM2 en utilisant le fichier de configuration `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [
    {
      name: 'porotein-api',
      script: 'dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

### Étapes de déploiement

1. Compiler le TypeScript :
   ```bash
   pnpm build
   ```

2. Démarrer avec PM2 :
   ```bash
   pm2 start ecosystem.config.js
   ```

---

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub. 