// Nom du cache pour les assets statiques
const CACHE_NAME = 'porotein-cache-v1';

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Mise en cache des assets essentiels
      return cache.addAll([
        '/',
        '/android/android-launchericon-192-192.png'
      ]);
    })
  );
  // Activer immédiatement le service worker sans attendre la fermeture des onglets
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Suppression du cache obsolète:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Prendre le contrôle de tous les clients sans recharger la page
      return self.clients.claim();
    })
  );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes vers l'API
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourne la réponse du cache si elle existe
      if (response) {
        return response;
      }

      // Sinon fait la requête réseau
      return fetch(event.request).then((response) => {
        // Ne met en cache que les requêtes GET réussies
        if (!response || response.status !== 200 || response.type !== 'basic' || event.request.method !== 'GET') {
          return response;
        }

        // Clone la réponse car elle ne peut être utilisée qu'une fois
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch((error) => {
        console.error('[Service Worker] Erreur lors de la récupération de la ressource:', error);
        // Retourner une réponse d'erreur personnalisée pour les ressources non critiques
        if (event.request.destination === 'image') {
          return new Response('Image non disponible', { status: 404, headers: { 'Content-Type': 'text/plain' } });
        }
        throw error;
      });
    })
  );
}); 