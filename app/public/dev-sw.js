// Service Worker de développement
self.addEventListener('install', (event) => {
  console.log('Service Worker installé');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activé');
  event.waitUntil(self.clients.claim());
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  console.log('Notification push reçue', event.data?.text());
  
  if (event.data) {
    try {
      const data = event.data.json();
      
      event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', {
          body: data.body || '',
          icon: '/android/android-launchericon-192-192.png',
          badge: '/android/android-launchericon-192-192.png',
          tag: data.tag || 'default',
          renotify: true,
          data: data.data || {}
        })
      );
    } catch (error) {
      console.error('Erreur lors du traitement de la notification push:', error);
    }
  }
});

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  console.log('Notification cliquée', event);
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si une fenêtre est déjà ouverte, on la focus
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        // Sinon on ouvre une nouvelle fenêtre
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
        return null;
      })
  );
}); 