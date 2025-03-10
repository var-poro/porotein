import { sendNotification, requestNotificationPermission } from './utils/notificationUtil.js';

// Demande la permission de notification dès la première connexion
(async function initializeNotificationPermission() {
  await requestNotificationPermission();
})();

/**
 * Démarre un timer pour une durée donnée en secondes et envoie une notification à la fin.
 * @param {number} durationInSeconds - Durée du timer en secondes.
 */
export function startTimer(durationInSeconds) {
  console.log(`Timer démarré pour ${durationInSeconds} secondes.`);
  setTimeout(() => {
    console.log('Timer terminé, envoi de la notification.');
    sendNotification(
      'Timer Terminé',
      `Votre timer de ${durationInSeconds} secondes est terminé.`
    );
  }, durationInSeconds * 1000);
}

// Exemple d'utilisation : démarrer un timer de 10 secondes
startTimer(10); 