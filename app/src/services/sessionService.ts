import apiClient from './apiService';
import { Session } from '@/types/Session';
import { Exercise } from '@/types/Exercise.ts';

export const getSessions = async () => {
  const response = await apiClient.get('/sessions');
  return response.data;
};

export const getSessionById = async (id: string | undefined) => {
  const response = await apiClient.get(`/sessions/${id}`);
  return response.data;
};

export const createSession = async (session: Session) => {
  const response = await apiClient.post('/sessions', session);
  return response.data;
};

export const updateSession = async (id: string, session: Session) => {
  const response = await apiClient.put(`/sessions/${id}`, session);
  return response.data;
};

export const deleteSession = async (id: string) => {
  const response = await apiClient.delete(`/sessions/${id}`);
  return response.data;
};

export const createExerciseInSession = async (
  sessionId: string,
  exercise: Exercise
) => {
  const response = await apiClient.post(
    `/sessions/${sessionId}/exercises`,
    exercise
  );
  return response.data;
};

export const updateExerciseInSession = async (
  sessionId: string,
  exerciseId: string,
  exercise: Exercise
) => {
  const response = await apiClient.put(
    `/sessions/${sessionId}/exercises/${exerciseId}`,
    exercise
  );
  return response.data;
};

export const deleteExerciseFromSession = async (
  sessionId: string,
  exerciseId: string
) => {
  const response = await apiClient.delete(
    `/sessions/${sessionId}/exercises/${exerciseId}`
  );
  return response.data;
};

export const getRecommendedSessions = async () => {
  const response = await apiClient.get('/saved-sessions/recommended');
  return response.data;
};
