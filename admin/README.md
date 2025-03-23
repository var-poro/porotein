# Administration

Cette application est la partie administration de l'application principale. Elle permet de gérer les utilisateurs, les contenus et les paramètres de l'application.

## Prérequis

- Node.js (v16 ou supérieur)
- pnpm (v7 ou supérieur)

## Installation

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   pnpm install
   ```
3. Copier le fichier .env.example en .env :
   ```bash
   cp .env.example .env
   ```
4. Modifier le fichier .env avec les bonnes valeurs

## Développement

Pour lancer l'application en mode développement :

```bash
pnpm dev
```

## Production

Pour construire l'application pour la production :

```bash
pnpm build
```

Pour prévisualiser la version de production :

```bash
pnpm preview
```

## Structure du projet

```
src/
  ├── components/     # Composants réutilisables
  ├── context/       # Contextes React
  ├── pages/         # Pages de l'application
  ├── services/      # Services (API, etc.)
  └── App.tsx        # Composant principal
```

## Technologies utilisées

- React
- TypeScript
- Vite
- Mantine UI
- React Router
- React Query
- Axios
- React Hook Form
- React Hot Toast
