import apiClient from './apiService';
import { Exercise, RepSet } from '@/types/Exercise';

// Functions for Exercises
export const getExercises = async (): Promise<Exercise[]> => {
  const response = await apiClient.get('/exercises');
  return response.data;
};

export const getExerciseById = async (id: string): Promise<Exercise> => {
  const response = await apiClient.get(`/exercises/${id}`);
  return response.data;
};

export const createExercise = async (exercise: Exercise): Promise<Exercise> => {
  const response = await apiClient.post('/exercises', exercise);
  return response.data;
};

export const updateExercise = async (
  id: string,
  exercise: Exercise
): Promise<Exercise> => {
  const response = await apiClient.put(`/exercises/${id}`, exercise);
  return response.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
  await apiClient.delete(`/exercises/${id}`);
};

// Functions for RepSets
export const createRepSet = async (
  exerciseId: string,
  repSet: RepSet
): Promise<RepSet> => {
  const response = await apiClient.post(
    `/exercises/${exerciseId}/reps`,
    repSet
  );
  return response.data;
};

export const getRepSetById = async (
  exerciseId: string,
  repSetId: string
): Promise<RepSet> => {
  const response = await apiClient.get(
    `/exercises/${exerciseId}/reps/${repSetId}`
  );
  return response.data;
};

export const updateRepSet = async (
  exerciseId: string,
  repSetId: string,
  repSet: RepSet
): Promise<RepSet> => {
  const response = await apiClient.put(
    `/exercises/${exerciseId}/reps/${repSetId}`,
    repSet
  );
  return response.data;
};

export const deleteRepSet = async (
  exerciseId: string,
  repSetId: string
): Promise<void> => {
  await apiClient.delete(`/exercises/${exerciseId}/reps/${repSetId}`);
};

export const getRepSets = async (exerciseId: string): Promise<RepSet[]> => {
  const response = await apiClient.get(`/exercises/${exerciseId}/reps`);
  return response.data;
};
