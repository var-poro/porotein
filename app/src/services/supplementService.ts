import apiClient from './apiService';
import { Supplement } from '@/types/Supplement';

export const getSupplements = async (): Promise<Supplement[]> => {
  const response = await apiClient.get('/supplements');
  return response.data;
};

export const getSupplementById = async (id: string): Promise<Supplement> => {
  const response = await apiClient.get(`/supplements/${id}`);
  return response.data;
};

export const createSupplement = async (
  supplement: Supplement
): Promise<Supplement> => {
  const response = await apiClient.post('/supplements', supplement);
  return response.data;
};

export const updateSupplement = async (
  id: string,
  supplement: Supplement
): Promise<Supplement> => {
  const response = await apiClient.put(`/supplements/${id}`, supplement);
  return response.data;
};

export const deleteSupplement = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/supplements/${id}`);
  return response.data;
};
