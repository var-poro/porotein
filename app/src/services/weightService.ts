import { WeightEntry } from '@/types/Weight';
import apiClient from './apiService';

export const getWeightHistory = async (): Promise<WeightEntry[]> => {
  const response = await apiClient.get('/api/weight');
  return response.data;
};

export const addWeightEntry = async (data: Omit<WeightEntry, '_id'>): Promise<WeightEntry> => {
  const response = await apiClient.post('/api/weight', data);
  return response.data;
};

export const updateWeightEntry = async (id: string, data: Partial<WeightEntry>): Promise<WeightEntry> => {
  const response = await apiClient.put(`/api/weight/${id}`, data);
  return response.data;
};

export const deleteWeightEntry = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/api/weight/${id}`);
  return response.data;
};