import apiClient from './apiService';
import type { Notification as DbNotification } from '@/types/Notification';

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

// Vérifie si le navigateur supporte les notifications
const checkNotificationSupport = () => {
  return 'Notification' in window && !isIOS();
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

export const requestNotificationPermission = async () => {
  if (!checkNotificationSupport()) {
    console.log('Les notifications ne sont pas supportées sur cet appareil');
    return false;
  }

  try {
    const permission = await window.Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!checkNotificationSupport() || window.Notification.permission !== 'granted') {
    // Fallback pour iOS : utiliser un son et une vibration
    playNotificationSound();
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    return;
  }

  try {
    return new window.Notification(title, {
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-192-192.png',
      ...options
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
};

// Joue un son de notification
const playNotificationSound = () => {
  const audio = new Audio('/assets/notification.mp3');
  audio.play().catch(error => console.log('Erreur lors de la lecture du son:', error));
};
