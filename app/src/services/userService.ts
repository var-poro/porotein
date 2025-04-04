import apiClient from './apiService';
import { User } from '@/types/User';
import { Session } from '@/types/Session.ts';
import { Program } from '@/types/Program.ts';

export const getUserData = async (): Promise<User> => {
  const response = await apiClient.get('/users/current');
  return response.data;
};

export interface UpdateUserDataInput {
  username?: string;
  email?: string;
  connectedDevice?: {
    type: 'apple-watch' | 'garmin' | 'fitbit' | null;
    enabled: boolean;
  };
}

export const updateUserData = async (data: UpdateUserDataInput): Promise<User> => {
  const response = await apiClient.put('/users/current', data);
  return response.data;
};

export const getProgramSessions = async (
  programId: string
): Promise<Session[]> => {
  const response = await apiClient.get(`/programs/${programId}/sessions`);
  return response.data;
};

export const getStatisticsData = async (
  userId: string
): Promise<{ date: string; value: number }[]> => {
  const response = await apiClient.get(`/users/${userId}/statistics`);
  return response.data;
};

export const getAllPrograms = async (): Promise<Program[]> => {
  const response = await apiClient.get('/programs');
  return response.data;
};

export const getAllSessions = async (): Promise<Session[]> => {
  const response = await apiClient.get('/sessions');
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: User): Promise<User> => {
  const response = await apiClient.post('/users', user);
  return response.data;
};

export const updateUser = async (id: string, user: User): Promise<User> => {
  const response = await apiClient.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
