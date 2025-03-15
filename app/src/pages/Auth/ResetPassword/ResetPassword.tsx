import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import styles from './ResetPassword.module.scss';
import apiClient from '@/services/apiService';
import { ApiError, ApiResponse } from '@/types/api';

interface ResetPasswordFormInputs {
  password: string;
  confirmPassword: string;
}

const resetPassword = async ({ password, token }: { password: string; token: string }): Promise<ApiResponse> => {
  const response = await apiClient.post('/auth/reset-password', { password, token });
  return response.data;
};

const ResetPassword: React.FC = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormInputs>();

  const resetPasswordMutation = useMutation(
    (data: ResetPasswordFormInputs) => resetPassword({ password: data.password, token: token || '' }),
    {
      onSuccess: () => {
        toast.success('Votre mot de passe a été réinitialisé avec succès.');
        navigate('/login');
      },
      onError: (error: ApiError) => {
        toast.error(error.response?.data?.error || 'Une erreur est survenue.');
      },
    }
  );

  const onSubmit: SubmitHandler<ResetPasswordFormInputs> = (data) => {
    if (!token) {
      toast.error('Token de réinitialisation invalide');
      return;
    }
    resetPasswordMutation.mutate(data);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <h1>Réinitialisation du mot de passe</h1>
      <p>Entrez votre nouveau mot de passe.</p>

      <div className={styles.inputContainer}>
        <label htmlFor="password">Nouveau mot de passe</label>
        <input
          id="password"
          type="password"
          {...register('password', {
            required: 'Le mot de passe est requis',
            minLength: {
              value: 8,
              message: 'Le mot de passe doit contenir au moins 8 caractères',
            },
          })}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.inputContainer}>
        <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'La confirmation du mot de passe est requise',
            validate: (value) =>
              value === watch('password') || 'Les mots de passe ne correspondent pas',
          })}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={resetPasswordMutation.isLoading}
      >
        {resetPasswordMutation.isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
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

export default ResetPassword; 