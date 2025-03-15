// services/savedSessionService.ts
import { Exercise, RepSet } from '@/types/Exercise';
import apiClient from './apiService';
import { Session } from 'inspector';

export const getSavedSessions = async (filter?: 'week' | 'month' | 'all') => {
  const { data } = await apiClient.get('/saved-sessions', {
    params: { filter }
  });
  return data;
};

export const getSavedSessionsBySessionId = async (sessionId: string) => {
  const { data } = await apiClient.get(`/saved-sessions/by-session/${sessionId}`);
  return data;
};

export const getSavedSessionById = async (id: string) => {
  const { data } = await apiClient.get(`/saved-sessions/${id}`);
  return data;
};

export const deleteSavedSession = async (id: string) => {
  const { data } = await apiClient.delete(`/saved-sessions/${id}`);
  return data;
};

export const createSavedExercise = async (sessionId: string, exercise: Exercise) => {
  const { data } = await apiClient.post(
    `/saved-sessions/${sessionId}/exercises`,
    exercise
  );
  return data;
};

export const updateSavedExercise = async (
  sessionId: string,
  exerciseId: string,
  exercise: Exercise
) => {
  const { data } = await apiClient.put(
    `/saved-sessions/${sessionId}/exercises/${exerciseId}`,
    exercise
  );
  return data;
};

export const createSavedRepSet = async (
  sessionId: string,
  exerciseId: string,
  repSet: RepSet
) => {
  const { data } = await apiClient.post(
    `/saved-sessions/${sessionId}/exercises/${exerciseId}/reps`,
    repSet
  );
  return data;
};

export const updateSavedRepSet = async (
  sessionId: string,
  exerciseId: string,
  repSetId: string,
  repSet: RepSet
) => {
  const { data } = await apiClient.put(
    `/saved-sessions/${sessionId}/exercises/${exerciseId}/reps/${repSetId}`,
    repSet
  );
  return data;
};

export const saveSession = async (sessionData: Session) => {
  const { data } = await apiClient.post('/saved-sessions', sessionData);
  return data;
};

export const getLatestSavedSessions = async () => {
  const { data } = await apiClient.get('/saved-sessions/latest');
  return data;
};
