import apiClient from './apiService';
import type { Notification as DbNotification } from '@/types/Notification';

// Extension des options de notification pour inclure les propriétés PWA
interface PWANotificationOptions extends NotificationOptions {
  vibrate?: number[];
  tag?: string;
  renotify?: boolean;
  playSound?: boolean; // Option pour jouer ou non le son
}

// Vérifie si le navigateur supporte les notifications
const checkNotificationSupport = () => {
  return 'Notification' in window && 
         'serviceWorker' in navigator && 
         !isIOS();
};

// Vérifie si l'appareil est un iOS
const isIOS = () => {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
};

// Enregistre le service worker pour les notifications
const registerServiceWorker = async () => {
  try {
    console.log('Tentative d\'enregistrement du service worker...');
    
    // En mode développement, utiliser le service worker de développement
    const swPath = import.meta.env.DEV ? '/dev-sw.js' : '/sw.js';
    console.log(`Utilisation du service worker: ${swPath}`);
    
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('Service worker enregistré avec succès:', registration);
    return registration;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du service worker:', error);
    return null;
  }
};

export const requestNotificationPermission = async () => {
  if (!checkNotificationSupport()) {
    console.log('Les notifications ne sont pas supportées sur cet appareil');
    return false;
  }

  try {
    // Enregistre le service worker d'abord
    const registration = await registerServiceWorker();
    if (!registration) {
      return false;
    }

    // Demande la permission
    const permission = await window.Notification.requestPermission();
    console.log('Permission de notification:', permission);
    
    // Si la permission est accordée, on souscrit aux notifications push
    if (permission === 'granted') {
      try {
        // En mode développement, on ne s'abonne pas aux notifications push
        if (!import.meta.env.DEV) {
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: window.atob(import.meta.env.VITE_VAPID_PUBLIC_KEY || '')
          });
          
          // Envoie la subscription au serveur
          await apiClient.post('/push/subscribe', subscription);
        }
      } catch (error) {
        console.error('Erreur lors de la souscription aux notifications push:', error);
      }
    }

    return permission === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
};

export const sendNotification = async (title: string, options?: PWANotificationOptions) => {
  if (!checkNotificationSupport() || window.Notification.permission !== 'granted') {
    // Fallback pour iOS et navigateurs non supportés
    if (options?.playSound !== false) {
      playNotificationSound();
    }
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    return;
  }

  try {
    console.log('Tentative d\'envoi de notification via service worker');
    const registration = await navigator.serviceWorker.ready;
    console.log('Service worker prêt:', registration);
    
    // Utilise le service worker pour envoyer la notification
    await registration.showNotification(title, {
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-192-192.png',
      tag: 'timer-notification', // Pour regrouper les notifications similaires
      renotify: true, // Pour permettre plusieurs notifications avec le même tag
      ...options
    } as PWANotificationOptions);
    console.log('Notification envoyée avec succès');
    
    // Jouer le son si l'option n'est pas désactivée
    if (options?.playSound !== false) {
      playNotificationSound();
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    
    // Fallback vers les notifications natives si le service worker échoue
    try {
      console.log('Tentative de fallback vers les notifications natives');
      const notification = new window.Notification(title, {
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-192-192.png',
        ...options
      });
      
      // Jouer le son si l'option n'est pas désactivée
      if (options?.playSound !== false) {
        playNotificationSound();
      }
      
      return notification;
    } catch (fallbackError) {
      console.error('Erreur lors du fallback de notification:', fallbackError);
    }
  }
};

// Joue un son de notification
export const playNotificationSound = () => {
  const audio = new Audio('/assets/notification.mp3');
  audio.play().catch(error => console.log('Erreur lors de la lecture du son:', error));
};

// Export des fonctions de gestion des notifications DB
export const getNotifications = async (): Promise<DbNotification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getNotificationById = async (
  id: string
): Promise<DbNotification> => {
  const response = await apiClient.get(`/notifications/${id}`);
  return response.data;
};

export const createNotification = async (
  notification: DbNotification
): Promise<DbNotification> => {
  const response = await apiClient.post('/notifications', notification);
  return response.data;
};

export const updateNotification = async (
  id: string,
  notification: DbNotification
): Promise<DbNotification> => {
  const response = await apiClient.put(`/notifications/${id}`, notification);
  return response.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};
