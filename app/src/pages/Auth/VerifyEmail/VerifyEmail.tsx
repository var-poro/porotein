import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import styles from './VerifyEmail.module.scss';
import apiClient from '@/services/apiService';
import { ApiError } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { DecodedToken } from '@/utils/tokenUtils';
import { setToken } from '@/utils/tokenUtils';

interface VerifyEmailResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    emailVerified: boolean;
  };
  accessToken: string;
}

const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const response = await apiClient.post('/auth/verify-email', { token });
  return response.data;
};

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const token = searchParams.get('token');

  const verifyEmailMutation = useMutation(
    (token: string) => verifyEmail(token),
    {
      onSuccess: (data) => {
        setToken(data.accessToken);
        
        const user: DecodedToken = {
          userId: data.user.id,
          username: data.user.username,
          email: data.user.email,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 heures
        };
        
        login(user, navigate);
      },
      onError: (error: ApiError) => {
        toast.error(error.response?.data?.message || 'Une erreur est survenue lors de la vérification de l\'email.');
        navigate('/login');
      },
    }
  );

  useEffect(() => {
    if (!token) {
      toast.error('Token de vérification manquant');
      navigate('/login');
      return;
    }

    verifyEmailMutation.mutate(token);
  }, [token, navigate]);

  return (
    <div className={styles.container}>
      <h1>Vérification de votre email</h1>
      <p>Veuillez patienter pendant la vérification de votre email...</p>
    </div>
  );
};

export default VerifyEmail; 