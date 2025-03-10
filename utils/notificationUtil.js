/* utils/notificationUtil.js */

/**
 * Demande la permission de notification dès le chargement de l'application.
 * Doit être appelée une seule fois lors de la première connexion.
 * 
 * @returns {Promise<string>} - "granted", "denied" ou "default"
 *
 * Référence : https://developer.mozilla.org/fr/docs/Web/API/Notification/requestPermission
 */
export async function requestNotificationPermission() {
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') {
    console.warn("Permission de notification refusée.");
    return 'denied';
  }
  return await Notification.requestPermission();
}

/**
 * Envoie une notification avec le titre, le message et les options fournies.
 * Utilise l'enregistrement du Service Worker pour envoyer la notification quand l'app est en arrière-plan.
 * Sinon, elle utilise le constructeur Notification.
 * 
 * @param {string} title - Le titre de la notification.
 * @param {string} body - Le contenu/message de la notification.
 * @param {Object} options - Options additionnelles pour la notification (par exemple, icône, vibrate, etc.).
 *
 * Référence : https://developer.mozilla.org/fr/docs/Web/API/ServiceWorkerRegistration/showNotification
 */
export async function sendNotification(title, body, options = {}) {
  if (Notification.permission !== 'granted') {
    console.warn("Permission de notification non accordée.");
    return;
  }
  
  // Construit la charge utile en fusionnant le corps avec les options fournies
  const payload = { ...options, body };

  // Récupère l'enregistrement du Service Worker
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration && typeof registration.showNotification === 'function') {
    registration.showNotification(title, payload);
  } else {
    new Notification(title, payload);
  }
} 