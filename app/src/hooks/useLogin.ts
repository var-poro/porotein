import { useMutation } from 'react-query';
import apiClient from '@/services/apiService';
import { ApiError } from '@/types/api';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
  };
  accessToken: string;
}

interface LoginData {
  identifier: string;
  password: string;
}

const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const useLogin = () => {
  return useMutation<LoginResponse, ApiError, LoginData>(login);
}; 