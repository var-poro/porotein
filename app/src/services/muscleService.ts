import apiClient from './apiService';
import { Muscle } from '@/types/Muscle';

export const getMuscles = async (): Promise<Muscle[]> => {
  const response = await apiClient.get('/muscles');
  return response.data;
};

export const getMuscleById = async (id: string): Promise<Muscle> => {
  const response = await apiClient.get(`/muscles/${id}`);
  return response.data;
};

export const createMuscle = async (muscle: Muscle): Promise<Muscle> => {
  const response = await apiClient.post('/muscles', muscle);
  return response.data;
};

export const updateMuscle = async (
  id: string,
  muscle: Muscle
): Promise<Muscle> => {
  const response = await apiClient.put(`/muscles/${id}`, muscle);
  return response.data;
};

export const deleteMuscle = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/muscles/${id}`);
  return response.data;
};
