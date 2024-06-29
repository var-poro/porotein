import apiClient from './apiService';
import { Tag } from '@/types/Tag';

export const getTags = async (): Promise<Tag[]> => {
  const response = await apiClient.get('/tags');
  return response.data;
};

export const getTagById = async (id: string): Promise<Tag> => {
  const response = await apiClient.get(`/tags/${id}`);
  return response.data;
};

export const createTag = async (tag: Tag): Promise<Tag> => {
  const response = await apiClient.post('/tags', tag);
  return response.data;
};

export const updateTag = async (id: string, tag: Tag): Promise<Tag> => {
  const response = await apiClient.put(`/tags/${id}`, tag);
  return response.data;
};

export const deleteTag = async (id: string): Promise<void> => {
  const response = await apiClient.delete(`/tags/${id}`);
  return response.data;
};
