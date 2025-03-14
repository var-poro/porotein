# Frontend Porotein - Documentation Technique

Cette documentation détaille l'architecture, les composants et les fonctionnalités de l'application frontend Porotein.

## Table des matières

- [Architecture](#architecture)
- [Configuration](#configuration)
- [Structure des dossiers](#structure-des-dossiers)
- [Composants](#composants)
- [Hooks personnalisés](#hooks-personnalisés)
- [Services](#services)
- [Gestion d'état](#gestion-détat)
- [Routage](#routage)
- [Styles](#styles)
- [PWA et fonctionnalités hors ligne](#pwa-et-fonctionnalités-hors-ligne)
- [Déploiement](#déploiement)

## Architecture

L'application frontend Porotein est construite avec :

- **React** : Bibliothèque UI pour la construction d'interfaces utilisateur
- **TypeScript** : Superset typé de JavaScript
- **React Router** : Gestion du routage
- **React Query** : Gestion des requêtes API et du cache
- **SCSS Modules** : Styles modulaires et scoped

L'architecture est basée sur les composants, avec une séparation claire des préoccupations :
- **Composants** : Éléments d'interface réutilisables
- **Pages** : Assemblages de composants pour former des vues complètes
- **Services** : Logique d'accès aux données et communication avec l'API
- **Hooks** : Logique réutilisable et gestion d'état
- **Contextes** : État global partagé entre les composants

## Configuration

### Variables d'environnement

L'application utilise les variables d'environnement suivantes (à définir dans le fichier `.env.local`) :

```
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_NAME=Porotein
```

### Vite

L'application utilise Vite comme outil de build et de développement. La configuration se trouve dans `vite.config.ts`.

## Structure des dossiers

```
/src
  /assets        # Images, icônes, etc.
  /components    # Composants réutilisables
  /context       # Contextes React pour la gestion d'état global
  /hooks         # Hooks personnalisés
  /pages         # Pages de l'application
  /routes        # Configuration des routes
  /services      # Services pour les appels API
  /styles        # Styles globaux et variables
  /types         # Types TypeScript
  /utils         # Fonctions utilitaires
  main.tsx       # Point d'entrée de l'application
```

## Composants

Les composants sont organisés par fonctionnalité, chacun dans son propre dossier avec ses styles et tests associés.

### Structure d'un composant

```
/ComponentName
  ComponentName.tsx       # Code du composant
  ComponentName.module.scss  # Styles spécifiques au composant
  index.ts                # Export du composant
```

### Composants principaux

#### BottomNav

Navigation principale de l'application, située en bas de l'écran.

```tsx
// Exemple simplifié
const BottomNav: React.FC = () => {
  return (
    <nav className={styles.bottomNav}>
      <NavLink to="/">
        <IoIosFitness />
      </NavLink>
      {/* Autres liens de navigation */}
    </nav>
  );
};
```

#### Modal

Composant de fenêtre modale réutilisable.

```tsx
// Exemple simplifié
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {title && <h2>{title}</h2>}
        {children}
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};
```

#### RepSetInputs

Composant pour la saisie des répétitions et séries d'exercices.

#### Timer

Chronomètre pour les exercices et les pauses.

#### TagSelector

Sélecteur de tags pour les exercices.

## Hooks personnalisés

### useAuth

Hook pour gérer l'authentification et l'utilisateur courant.

```typescript
// Exemple simplifié
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation(login, {
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries('user');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    removeToken();
    queryClient.invalidateQueries('user');
  };
};

export const useUser = () => {
  const user = getUserFromToken();
  return user;
};
```

## Services

Les services gèrent la communication avec l'API backend.

### apiService

Service de base pour les appels API avec gestion des tokens.

```typescript
// Exemple simplifié
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion du rafraîchissement des tokens
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Logique de rafraîchissement du token
  }
);
```

### authService

Service pour l'authentification.

```typescript
// Exemple simplifié
export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: { username: string; email: string; password: string }) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await apiClient.post('/auth/refresh-token');
  return response.data;
};
```

### Autres services

- **userService** : Gestion des utilisateurs
- **programService** : Gestion des programmes
- **sessionService** : Gestion des sessions
- **exerciseService** : Gestion des exercices
- **weightService** : Gestion des poids

## Gestion d'état

### Contexte d'authentification

Le contexte d'authentification (`AuthContext`) gère l'état global de l'authentification.

```typescript
// Exemple simplifié
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);

  // Logique d'initialisation et de gestion de l'authentification

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### React Query

React Query est utilisé pour la gestion des requêtes API et du cache.

```typescript
// Exemple d'utilisation
const { data: programs, isLoading, error } = useQuery('programs', fetchPrograms);
```

## Routage

Le routage est géré avec React Router. Les routes sont définies dans `src/routes/App.tsx`.

```tsx
// Exemple simplifié
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            {/* Autres routes protégées */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### Routes protégées

Les routes protégées nécessitent une authentification et sont gérées par le composant `PrivateRoute`.

```tsx
// Exemple simplifié
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  return user ? <Outlet /> : <Navigate to="/login" />;
};
```

## Styles

Les styles sont gérés avec SCSS Modules pour un scoping local des styles.

### Structure des styles

```
/styles
  _variables.scss   # Variables globales (couleurs, tailles, etc.)
  _mixins.scss      # Mixins SCSS réutilisables
  global.scss       # Styles globaux
```

### Exemple de module SCSS

```scss
// BottomNav.module.scss
@import '../../styles/variables';

.bottomNav {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: $primary-color;
  padding: 10px 0;
}

.active {
  color: $accent-color;
}
```

## PWA et fonctionnalités hors ligne

L'application est configurée comme une Progressive Web App (PWA) avec :

- Manifest pour l'installation sur l'écran d'accueil
- Service Worker pour le fonctionnement hors ligne
- Stratégies de mise en cache pour les ressources statiques et les données

## Déploiement

### Build de production

```bash
pnpm build
```

Cette commande génère les fichiers de production dans le dossier `dist`.

### Déploiement sur un serveur web

Les fichiers générés peuvent être déployés sur n'importe quel serveur web statique.

### Configuration pour le déploiement

Pour le déploiement en production, assurez-vous de configurer correctement les variables d'environnement, notamment `VITE_API_BASE_URL` qui doit pointer vers l'URL de production de l'API.

---

Pour toute question ou problème, veuillez ouvrir une issue sur le dépôt GitHub.
