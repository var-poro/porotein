import apiClient from './apiService';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const login = async (data: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const refreshAccessToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await apiClient.post('/auth/refresh-token');
  return response.data;
};
