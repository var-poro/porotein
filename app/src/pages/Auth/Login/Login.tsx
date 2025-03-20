import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/useLogin';
import { DecodedToken } from '@/utils/tokenUtils';
import apiClient from '@/services/apiService';
import { ApiError } from '@/types/api';
import toast from 'react-hot-toast';
import styles from './Login.module.scss';

interface LoginFormInputs {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    watch,
    formState: { errors: loginErrors },
    setError,
  } = useForm<LoginFormInputs>();
  const loginMutation = useLogin();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [magicLinkSuccess, setMagicLinkSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const identifier = watch('identifier');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (magicLinkSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [magicLinkSuccess, countdown]);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const loadingToast = toast.loading('Connexion en cours...');
    try {
      const response = await loginMutation.mutateAsync(data);
      const user: DecodedToken = {
        userId: response.user.id,
        username: response.user.username,
        email: response.user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      };
      toast.dismiss(loadingToast);
      login(user, navigate);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.error === 'Invalid email/username or password') {
        toast.error('L\'identifiant ou le mot de passe est incorrect.', {
          id: loadingToast,
        });
        setError('identifier', { type: 'manual' });
        setError('password', { type: 'manual' });
      } else {
        toast.error(`Une erreur est survenue. Veuillez réessayer.`, {
          id: loadingToast,
        });
      }
    }
  };

  const handleMagicLink = async () => {
    if (!identifier) {
      toast.error('Veuillez entrer votre email');
      setError('identifier', { type: 'manual' });
      return;
    }

    const loadingToast = toast.loading('Envoi du lien de connexion...');
    try {
      await apiClient.post('/auth/magic-link', { email: identifier });
      setMagicLinkSuccess(true);
      setCountdown(60);
      setCanResend(false);
      toast.success('Email envoyé avec succès !', {
        id: loadingToast,
      });
    } catch (error) {
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du lien.', {
        id: loadingToast,
      });
    }
  };

  if (magicLinkSuccess) {
    return (
      <div className={styles.container}>
        <h1>Email envoyé !</h1>
        <p>Un lien de connexion a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.</p>
        {!canResend ? (
          <p className={styles.countdown}>Vous pourrez en demander un nouveau dans {countdown} secondes</p>
        ) : (
          <button
            type="button"
            onClick={handleMagicLink}
            className={styles.magicLinkButton}
          >
            Renvoyer l'email
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setMagicLinkSuccess(false);
            setCountdown(60);
            setCanResend(false);
          }}
          className={styles.linkButton}
        >
          Retour à la connexion
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Quel plaisir de te revoir</h1>
      
      <form onSubmit={handleLoginSubmit(onSubmit)}>
        <div className={styles.inputContainer}>
          <label htmlFor="identifier">Identifiant</label>
          <input
            id="identifier"
            autoCapitalize="none"
            autoComplete="username"
            placeholder="poro"
            className={loginErrors.identifier ? styles.error : ''}
            {...registerLogin('identifier', { required: 'Ce champ est obligatoire' })}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            placeholder="********"
            type="password"
            autoComplete="current-password"
            className={loginErrors.password ? styles.error : ''}
            {...registerLogin('password', { required: 'Ce champ est obligatoire' })}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" disabled={loginMutation.isLoading}>
            {loginMutation.isLoading ? 'Connexion...' : 'Connexion'}
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
          >
            Se connecter sans mot de passe
          </button>
        </div>
      </form>

      <button
        type="button"
        onClick={() => navigate('/forgot-password')}
        className={styles.linkButton}
      >
        Mot de passe oublié ?
      </button>
      <div className={styles.registerLink}>
        <span>Pas encore membre ?</span>
        <button
          type="button"
          onClick={() => navigate('/register')}
          className={styles.registerButton}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
};

export default Login;
