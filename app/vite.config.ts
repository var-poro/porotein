import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// Charger les variables d'environnement en fonction du mode
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    server: {
      port: parseInt(env.VITE_APP_PORT || '3000', 10),
    },
    plugins: [react(),
      VitePWA({
        // Utilisation du mode generateSW pour générer un service worker
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        includeAssets: ['**/*'],
        // Définition du manifest pour l'installation sur l'écran d'accueil
        manifest: {
          name: 'Porotein',
          short_name: 'Porotein',
          description: 'Application de suivi de fitness',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // Configuration de Workbox
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,mp3}'],
          // Gestion des notifications push
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.porotein\.fr\/.*$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 1 jour
                },
              },
            },
          ],
        },
        devOptions: {
          // Options de développement
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    publicDir: 'public',
  };
});
