import apiClient from './apiService';
import { Program } from '@/types/Program';

export const getPrograms = async (): Promise<Program[]> => {
  const response = await apiClient.get('/programs');
  return response.data;
};

export const getProgramById = async (id: string): Promise<Program> => {
  const response = await apiClient.get(`/programs/${id}`);
  return response.data;
};

export const createProgram = async (
  program: Omit<Program, '_id' | 'userId' | 'createdAt' | 'sessions'>
): Promise<Program> => {
  const response = await apiClient.post('/programs', program);
  return response.data;
};

export const updateProgram = async (
  id: string,
  program: Program
): Promise<Program> => {
  const response = await apiClient.put(`/programs/${id}`, program);
  return response.data;
};

export const deleteProgram = async (id: string): Promise<void> => {
  await apiClient.delete(`/programs/${id}`);
};
