/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Pour que le compilateur TS reconnaisse le contexte du SW
declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// Précache tous les assets générés par le build.
// Workbox injectera dans self.__WB_MANIFEST la liste des fichiers à mettre en cache.
precacheAndRoute(self.__WB_MANIFEST || []);

// --- Caching des pages et assets ---

// 1. Gestion des navigations (HTML)
// Cette stratégie tente d’abord le réseau et, en cas d’échec (ex. hors-ligne), retourne le cache.
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache',
    networkTimeoutSeconds: 10,
  })
);

// 2. Gestion des assets statiques (JS, CSS, images)
// Ici, on utilise une stratégie "Stale-While-Revalidate" pour une réponse rapide, tout en actualisant en arrière-plan.
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
  })
);

// 3. Gestion des requêtes GET vers l'API (pour react-query par exemple)
// On essaie le réseau en priorité, avec un fallback sur le cache en cas d'absence de connexion.
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api') && request.method === 'GET',
  new NetworkFirst({
    cacheName: 'api-get-cache',
    networkTimeoutSeconds: 10,
  })
);

// --- Mise en place du Background Sync pour les POST ---

// Ici, on crée une file de synchronisation qui retentera d'envoyer les requêtes POST
// en cas d'échec (ex. hors-ligne). Le maxRetentionTime est en minutes (ici 24h).
const bgSyncPlugin = new BackgroundSyncPlugin('sessionQueue', {
  maxRetentionTime: 24 * 60, // 24 heures
});

// Intercepter les requêtes POST vers l'endpoint de création de séance.
// Adapte la condition si ton endpoint diffère.
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/sessions') && request.method === 'POST',
  new NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);