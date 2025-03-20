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
      toast.success('Un email de réinitialisation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.');
      
      setTimeout(() => {
        navigate('/login');
      }, 6000);
    },
    onError: (error: ApiError) => {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi de l\'email.';
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = (data) => {
    const loadingToast = toast.loading('Envoi de l\'email en cours...');
    
    forgotPasswordMutation.mutate(data, {
      onSettled: () => {
        toast.dismiss(loadingToast);
      },
    });
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
      <div className={styles.buttons}>
      <button
          type="button"
          className={styles.ghostButton}
          onClick={() => navigate('/login')}
        >
          Retour à la connexion
        </button>
      <button
        type="submit"
        disabled={forgotPasswordMutation.isLoading}
      >
        {forgotPasswordMutation.isLoading ? 'Envoi en cours...' : 'Envoyer'}
      </button>
      </div>
      
    </form>
  );
};

export default ForgotPassword; 