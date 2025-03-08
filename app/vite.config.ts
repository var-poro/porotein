import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();
export default defineConfig({
  server: {
    port: parseInt(process.env.VITE_APP_PORT || '3000', 10),
  },
  plugins: [react(),
    VitePWA({
      // Utilisation du mode injectManifest pour avoir un service worker personnalisé
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts', // Fichier du service worker
      // Le service worker se met à jour automatiquement quand une nouvelle version est disponible
      registerType: 'autoUpdate',
      // Définition du manifest pour l'installation sur l'écran d'accueil
      manifest: {
        name: 'Nom de l\'application',
        short_name: 'App',
        description: 'Description de l\'application',
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
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
