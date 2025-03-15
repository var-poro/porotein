import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/useAuth';
import { DecodedToken } from '@/utils/tokenUtils';
import styles from './Login.module.scss';

interface LoginFormInputs {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const loginMutation = useLogin();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const response = await loginMutation.mutateAsync(data);
      const user: DecodedToken = {
        userId: response.user.id,
        username: response.user.username,
        email: response.user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      login(user, navigate);
      setLoginError(null);
    } catch (error: any) {
      if (error?.response && error?.response?.status === 401) {
        setLoginError(`L'identifiant ou le mot de passe est incorrect.`);
      } else {
        setLoginError(`Une erreur inconnue s'est produite. ${error.message}`);
      }
    }
  };

  return (
    <form className={styles.loginContainer} onSubmit={handleSubmit(onSubmit)}>
      <h1>Quel plaisir de te revoir.</h1>
      <div className={styles.inputContainer}>
        <label htmlFor="identifier">Identifiant</label>
        <input
          id="identifier"
          autoCapitalize="none"
          autoComplete="username"
          placeholder="poro"
          {...register('identifier', { required: true })}
        />
        {errors.identifier && <span>Ce champ est obligatoire</span>}
      </div>
      <div className={styles.inputContainer}>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          placeholder="********"
          type="password"
          autoComplete="current-password"
          {...register('password', { required: true })}
        />
        {errors.password && <span>Ce champ est obligatoire</span>}
      </div>
      {loginError && <div className={styles.error}>{loginError}</div>}
      <button type="submit" disabled={loginMutation.isLoading}>
        {loginMutation.isLoading ? 'Connexion...' : 'Connexion'}
      </button>
      <div className={styles.links}>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className={styles.linkButton}
        >
          Créer un compte
        </button>
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className={styles.linkButton}
        >
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};

export default Login;
