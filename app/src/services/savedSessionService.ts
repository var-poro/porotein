// services/savedSessionService.ts
import apiClient from './apiService';

export const getSavedSessionById = async (id: string) => {
  const { data } = await apiClient.get(`/saved-sessions/${id}`);
  return data;
};

export const createSavedExercise = async (sessionId: string, exercise: any) => {
  const { data } = await apiClient.post(
    `/saved-sessions/${sessionId}/exercises`,
    exercise
  );
  return data;
};

export const updateSavedExercise = async (
  sessionId: string,
  exerciseId: string,
  exercise: any
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
  repSet: any
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
  repSet: any
) => {
  const { data } = await apiClient.put(
    `/saved-sessions/${sessionId}/exercises/${exerciseId}/reps/${repSetId}`,
    repSet
  );
  return data;
};
