/**
 * Service de gestion des notifications pour l'application.
 * Fournit des méthodes pour demander la permission et envoyer des notifications.
 */

/**
 * Demande la permission de notification dès le chargement de l'application.
 * Doit être appelée une seule fois lors de la première connexion.
 * 
 * @returns {Promise<NotificationPermission>} - "granted", "denied" ou "default"
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') {
    console.warn("Permission de notification refusée.");
    return 'denied';
  }
  return await Notification.requestPermission();
}

/**
 * Interface pour les options de notification
 */
export interface CustomNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  vibrate?: number[];
  tag?: string;
  data?: Record<string, unknown>;
  requireInteraction?: boolean;
  renotify?: boolean;
  silent?: boolean;
  // Ajoutez d'autres options selon vos besoins
}

/**
 * Envoie une notification avec le titre, le message et les options fournies.
 * Utilise l'enregistrement du Service Worker pour envoyer la notification quand l'app est en arrière-plan.
 * Sinon, elle utilise le constructeur Notification.
 * 
 * @param {string} title - Le titre de la notification.
 * @param {string} body - Le contenu/message de la notification.
 * @param {CustomNotificationOptions} options - Options additionnelles pour la notification.
 * @returns {Promise<void>}
 */
export async function sendNotification(
  title: string, 
  body: string, 
  options: CustomNotificationOptions = {}
): Promise<void> {
  if (Notification.permission !== 'granted') {
    console.warn("Permission de notification non accordée.");
    return;
  }
  
  // Construit la charge utile en fusionnant le corps avec les options fournies
  const payload = { ...options, body };

  try {
    // Récupère l'enregistrement du Service Worker
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration && 'showNotification' in registration) {
      await registration.showNotification(title, payload);
    } else {
      new Notification(title, payload);
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
}

/**
 * Vérifie si les notifications sont supportées par le navigateur.
 * 
 * @returns {boolean} - true si les notifications sont supportées, false sinon.
 */
export function areNotificationsSupported(): boolean {
  return 'Notification' in window;
}

/**
 * Obtient l'état actuel de la permission de notification.
 * 
 * @returns {NotificationPermission} - "granted", "denied" ou "default"
 */
export function getNotificationPermission(): NotificationPermission {
  return Notification.permission;
}

/**
 * Vérifie si l'appareil utilise iOS (iPhone, iPad, iPod).
 * Les notifications ne sont pas bien supportées sur iOS via Safari.
 * 
 * @returns {boolean} - true si l'appareil est sous iOS, false sinon.
 */
export function isIOS(): boolean {
  const userAgent = window.navigator.userAgent.toLowerCase();
  // Détection d'iOS sans utiliser MSStream
  return /iphone|ipad|ipod/.test(userAgent) && !/windows phone|android/.test(userAgent);
} 