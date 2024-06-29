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
