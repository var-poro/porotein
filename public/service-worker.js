// Nom du cache pour les assets statiques
const CACHE_NAME = 'porotein-cache-v1';

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Mise en cache des assets essentiels
      return cache.addAll([
        '/',
        '/assets/notification.mp3',
        '/android/android-launchericon-192-192.png'
      ]);
    })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', {
        body: data.body || '',
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-192-192.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'default',
        renotify: true,
        data: data.data || {}
      })
    );
  }
});

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Récupère les données associées à la notification
  const notificationData = event.notification.data;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, on la focus
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon on ouvre une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Gestion de la fermeture des notifications
self.addEventListener('notificationclose', (event) => {
  // On peut ajouter ici une logique pour tracker les notifications fermées
  const notification = event.notification;
  const notificationData = notification.data;
  // console.log('Notification fermée:', notificationData);
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', (event) => {
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
      });
    })
  );
}); 