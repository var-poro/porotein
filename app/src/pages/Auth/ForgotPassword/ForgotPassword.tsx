import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './ForgotPassword.module.scss';
import apiClient from '@/services/apiService';
import { ApiError, ApiResponse } from '@/types/api';

interface ForgotPasswordFormInputs {
  email: string;
}

const forgotPassword = async (data: ForgotPasswordFormInputs): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/forgot-password', data);
  return response.data;
};

const ForgotPassword: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormInputs>();
  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation(forgotPassword, {
    onSuccess: () => {
      toast.success('Un email de réinitialisation a été envoyé à votre adresse email.');
      navigate('/login');
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.error || 'Une erreur est survenue.');
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <h1>Mot de passe oublié</h1>
      <p>Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>
      
      <div className={styles.inputContainer}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'L\'email est requis',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Adresse email invalide',
            },
          })}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={forgotPasswordMutation.isLoading}
      >
        {forgotPasswordMutation.isLoading ? 'Envoi en cours...' : 'Envoyer'}
      </button>

      <div className={styles.links}>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className={styles.linkButton}
        >
          Retour à la connexion
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword; 