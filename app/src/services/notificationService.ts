import apiClient from './apiService';
import type { Notification as DbNotification } from '@/types/Notification';

// Déclaration pour webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

// Extension des options de notification pour inclure les propriétés PWA
interface PWANotificationOptions extends NotificationOptions {
  vibrate?: number[];
  tag?: string;
  renotify?: boolean;
  playSound?: boolean; // Option pour jouer ou non le son
}

// Fonction pour convertir une clé VAPID en Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Vérifie si l'appareil est un iOS
export const isIOS = () => {
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
    
    // Utiliser le même service worker pour le développement et la production
    const swPath = '/sw.js';
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
  // Vérifier si les notifications sont supportées
  if (!('Notification' in window)) {
    console.log('Les notifications ne sont pas supportées sur ce navigateur');
    return false;
  }

  try {
    // Enregistrer le service worker d'abord
    await registerServiceWorker();
    
    // Vérifier la permission actuelle
    if (Notification.permission === 'granted') {
      console.log('Permission de notification déjà accordée');
      return true;
    }
    
    // Si la permission n'a pas été refusée, la demander
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      console.log('Permission de notification:', permission);
      
      // Si la permission est accordée, souscrire aux notifications push
      if (permission === 'granted') {
        try {
          await subscribeToPushNotifications();
        } catch (error) {
          console.error('Erreur lors de la souscription aux notifications push:', error);
        }
      }
      
      return permission === 'granted';
    } else {
      console.log('Permission de notification déjà refusée');
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
};

// Fonction pour souscrire aux notifications push
const subscribeToPushNotifications = async () => {
  try {
    // Vérifier si la clé VAPID est disponible
    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.error('Clé VAPID publique non disponible');
      return false;
    }
    
    console.log('Tentative de souscription aux notifications push');
    
    // Obtenir l'enregistrement du service worker
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      console.error('Aucun service worker enregistré');
      return false;
    }
    
    // Convertir la clé VAPID en Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    
    // Souscrire aux notifications push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    
    console.log('Souscription aux notifications push réussie:', subscription);
    
    // Envoie la subscription au serveur
    await apiClient.post('/push/subscribe', subscription);
    console.log('Souscription envoyée au serveur');
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la souscription aux notifications push:', error);
    return false;
  }
};

export const sendNotification = async (title: string, options?: PWANotificationOptions) => {
  // Vérifier si les notifications sont supportées
  if (!('Notification' in window)) {
    console.log('Les notifications ne sont pas supportées sur ce navigateur');
    
    // Fallback pour les navigateurs sans support de notification
    if (options?.playSound !== false) {
      playNotificationSound(isIOS());
    }
    
    // Afficher une notification visuelle pour iOS
    if (isIOS()) {
      showIOSNotification(title, options?.body || '');
    }
    
    return;
  }
  
  // Suivre la logique exacte de whatpwacando.today
  if (Notification.permission === 'granted') {
    // Permission déjà accordée, afficher la notification
    await showNotification(title, options);
  } else {
    // Vérifier si la permission n'a pas été refusée
    if (Notification.permission !== 'denied') {
      // Demander la permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Permission accordée, afficher la notification
        await showNotification(title, options);
      } else {
        console.log('Permission de notification refusée');
        
        // Fallback si la permission est refusée
        if (options?.playSound !== false) {
          playNotificationSound(isIOS());
        }
        
        // Afficher une notification visuelle pour iOS
        if (isIOS()) {
          showIOSNotification(title, options?.body || '');
        }
      }
    } else {
      console.log('Permission de notification déjà refusée');
      
      // Fallback si la permission est déjà refusée
      if (options?.playSound !== false) {
        playNotificationSound(isIOS());
      }
      
      // Afficher une notification visuelle pour iOS
      if (isIOS()) {
        showIOSNotification(title, options?.body || '');
      }
    }
  }
};

// Fonction pour afficher une notification (similaire à whatpwacando.today)
const showNotification = async (title: string, options?: PWANotificationOptions) => {
  try {
    // Obtenir l'enregistrement du service worker
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      console.error('Aucun service worker enregistré');
      throw new Error('Aucun service worker enregistré');
    }
    
    // Préparer les options de notification
    const notificationOptions = {
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-192-192.png',
      tag: 'timer-notification',
      renotify: true,
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Ouvrir l\'application'
        },
        {
          action: 'close',
          title: 'Fermer'
        }
      ],
      ...options
    };
    
    // Utiliser la méthode appropriée pour afficher la notification
    if ('showNotification' in registration) {
      // Utiliser le service worker pour afficher la notification
      await registration.showNotification(title, notificationOptions);
      console.log('Notification envoyée via service worker');
    } else {
      // Fallback vers les notifications natives
      new Notification(title, notificationOptions);
      console.log('Notification envoyée via API native');
    }
    
    // Jouer le son si l'option n'est pas désactivée
    if (options?.playSound !== false) {
      playNotificationSound();
    }
  } catch (error) {
    console.error('Erreur lors de l\'affichage de la notification:', error);
    
    // Fallback en cas d'erreur
    try {
      // Essayer d'utiliser l'API Notification directement
      new Notification(title, {
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-192-192.png',
        ...options
      });
      
      // Jouer le son si l'option n'est pas désactivée
      if (options?.playSound !== false) {
        playNotificationSound();
      }
    } catch (fallbackError) {
      console.error('Erreur lors du fallback de notification:', fallbackError);
      
      // Dernier recours : notification visuelle et son
      if (options?.playSound !== false) {
        playNotificationSound(isIOS());
      }
      
      if (isIOS()) {
        showIOSNotification(title, options?.body || '');
      }
    }
  }
};

// Joue un son de notification
export const playNotificationSound = (isLoud = false) => {
  try {
    console.log('Tentative de lecture du son de notification');
    
    // Sur iOS, utiliser une approche plus directe
    if (isIOS()) {
      // Précharger le son pour iOS
      const audio = new Audio('/assets/Positive Notification Sound.mp3');
      audio.volume = isLoud ? 1.0 : 0.7;
      
      // Sur iOS, il est important de déclencher la lecture suite à une interaction utilisateur
      // Mais comme nous sommes dans un contexte de notification, nous essayons quand même
      audio.load();
      
      // Utiliser une promesse pour gérer la lecture
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Son de notification joué avec succès sur iOS');
        }).catch(error => {
          console.error('Erreur lors de la lecture du son sur iOS:', error);
          // Fallback pour iOS : utiliser un oscillateur simple
          try {
            const AudioContextClass = window.AudioContext;
            const audioCtx = new AudioContextClass();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // La note A5 (880Hz)
            
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(isLoud ? 0.5 : 0.3, audioCtx.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            console.log('Son de secours (oscillateur) joué avec succès sur iOS');
          } catch (oscError) {
            console.error('Impossible de jouer un son de secours sur iOS:', oscError);
          }
        });
      }
      return;
    }
    
    // Pour les autres navigateurs, utiliser AudioContext
    const windowWithWebkit = window as WindowWithWebkit;
    if (window.AudioContext || windowWithWebkit.webkitAudioContext) {
      const AudioContextClass = window.AudioContext || windowWithWebkit.webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      // Charger le son via XMLHttpRequest
      const request = new XMLHttpRequest();
      request.open('GET', '/assets/Positive Notification Sound.mp3', true);
      request.responseType = 'arraybuffer';
      
      request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          // Créer une source audio
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          
          // Créer un nœud de gain pour contrôler le volume
          const gainNode = audioContext.createGain();
          gainNode.gain.value = isLoud ? 1.0 : 0.7;
          
          // Connecter les nœuds
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Jouer le son
          source.start(0);
          console.log('Son de notification joué avec succès (AudioContext)');
        }, function(error) {
          console.error('Erreur lors du décodage audio:', error);
          fallbackAudio();
        });
      };
      
      request.onerror = fallbackAudio;
      request.send();
    } else {
      fallbackAudio();
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du son:', error);
    fallbackAudio();
  }
  
  // Méthode de secours utilisant l'API Audio standard
  function fallbackAudio() {
    console.log('Utilisation de la méthode de secours pour le son');
    const audio = new Audio('/assets/Positive Notification Sound.mp3');
    audio.volume = isLoud ? 1.0 : 0.7;
    
    // Précharger l'audio
    audio.load();
    
    // Essayer de jouer le son après un court délai
    setTimeout(() => {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Erreur lors de la lecture du son (fallback):', error);
          
          // Dernier recours : utiliser un oscillateur simple
          try {
            const windowWithWebkit = window as WindowWithWebkit;
            if (window.AudioContext || windowWithWebkit.webkitAudioContext) {
              const AudioContextClass = window.AudioContext || windowWithWebkit.webkitAudioContext;
              const audioCtx = new AudioContextClass();
              const oscillator = audioCtx.createOscillator();
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // La note A (440Hz)
              oscillator.connect(audioCtx.destination);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.5); // Jouer pendant 0.5 secondes
              console.log('Son de secours (oscillateur) joué avec succès');
            }
          } catch (oscError) {
            console.error('Impossible de jouer un son de secours:', oscError);
          }
        });
      }
    }, 100);
  }
};

// Fonction pour afficher une notification visuelle sur iOS
const showIOSNotification = (title: string, body: string) => {
  // Créer un élément de notification
  const notification = document.createElement('div');
  notification.className = 'ios-notification';
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = '#4a6cf7';
  notification.style.color = '#fff';
  notification.style.padding = '15px 20px';
  notification.style.borderRadius = '10px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '90%';
  notification.style.width = '350px';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.justifyContent = 'space-between';
  notification.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  notification.style.animation = 'fadeIn 0.3s ease-out';
  
  // Ajouter le style d'animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translate(-50%, -20px); }
      to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: translate(-50%, 0); }
      to { opacity: 0; transform: translate(-50%, -20px); }
    }
  `;
  document.head.appendChild(style);
  
  // Ajouter le contenu
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.flex = '1';
  
  // Ajouter une icône
  const icon = document.createElement('div');
  icon.textContent = '🔔';
  icon.style.fontSize = '24px';
  icon.style.marginRight = '12px';
  
  const textContent = document.createElement('div');
  
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.fontWeight = 'bold';
  titleElement.style.marginBottom = '5px';
  titleElement.style.fontSize = '16px';
  
  const bodyElement = document.createElement('div');
  bodyElement.textContent = body;
  bodyElement.style.fontSize = '14px';
  bodyElement.style.opacity = '0.9';
  
  textContent.appendChild(titleElement);
  textContent.appendChild(bodyElement);
  
  content.appendChild(icon);
  content.appendChild(textContent);
  
  // Ajouter un bouton de fermeture
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = '#fff';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.marginLeft = '10px';
  closeButton.style.padding = '0 5px';
  closeButton.style.opacity = '0.8';
  
  closeButton.onmouseover = () => {
    closeButton.style.opacity = '1';
  };
  
  closeButton.onmouseout = () => {
    closeButton.style.opacity = '0.8';
  };
  
  closeButton.onclick = () => {
    // Animation de fermeture
    notification.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  };
  
  // Assembler la notification
  notification.appendChild(content);
  notification.appendChild(closeButton);
  
  // Ajouter au DOM
  document.body.appendChild(notification);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      // Animation de fermeture
      notification.style.animation = 'fadeOut 0.3s ease-out forwards';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
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
