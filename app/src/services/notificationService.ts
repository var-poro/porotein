import apiClient from './apiService';
import { Notification } from '@/types/Notification';

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const getNotificationById = async (
  id: string
): Promise<Notification> => {
  const response = await apiClient.get(`/notifications/${id}`);
  return response.data;
};

export const createNotification = async (
  notification: Notification
): Promise<Notification> => {
  const response = await apiClient.post('/notifications', notification);
  return response.data;
};

export const updateNotification = async (
  id: string,
  notification: Notification
): Promise<Notification> => {
  const response = await apiClient.put(`/notifications/${id}`, notification);
  return response.data;
};

export const deleteNotification = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/notifications/${id}`);
  return response.data;
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('Ce navigateur ne supporte pas les notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    return new Notification(title, {
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-192-192.png',
      ...options
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
  }
};
