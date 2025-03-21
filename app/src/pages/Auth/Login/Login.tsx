import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLogin } from '@/hooks/useLogin';
import { DecodedToken } from '@/utils/tokenUtils';
import apiClient from '@/services/apiService';
import { ApiError } from '@/types/api';
import toast from 'react-hot-toast';
import { TextInput, PasswordInput, Button, Stack, Text, Container, Paper, Title, Group, Anchor } from '@mantine/core';

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
      <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Paper radius="md" p="xl" withBorder w="100%">
          <Stack>
            <Title order={1}>Email envoyé !</Title>
            <Text>Un lien de connexion a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception.</Text>
            {!canResend ? (
              <Text c="dimmed">Vous pourrez en demander un nouveau dans {countdown} secondes</Text>
            ) : (
              <Button variant="subtle" onClick={handleMagicLink} fullWidth>
                Renvoyer l'email
              </Button>
            )}
            <Button variant="subtle" onClick={() => {
              setMagicLinkSuccess(false);
              setCountdown(60);
              setCanResend(false);
            }} fullWidth>
              Retour à la connexion
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder w="100%">
        <Stack>
          <Title order={1}>Quel plaisir de te revoir</Title>
          
          <form onSubmit={handleLoginSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="Identifiant"
                placeholder="poro"
                error={loginErrors.identifier?.message}
                {...registerLogin('identifier', { required: 'Ce champ est obligatoire' })}
              />
              <PasswordInput
                label="Mot de passe"
                placeholder="********"
                error={loginErrors.password?.message}
                {...registerLogin('password', { required: 'Ce champ est obligatoire' })}
              />
              <Stack>
                <Button type="submit" loading={loginMutation.isLoading} fullWidth>
                  {loginMutation.isLoading ? 'Connexion...' : 'Connexion'}
                </Button>
                <Button variant="light" onClick={handleMagicLink} fullWidth>
                  Se connecter sans mot de passe
                </Button>
              </Stack>
            </Stack>
          </form>

          <Group justify="center">
            <Anchor component="button" type="button" variant="subtle" onClick={() => navigate('/forgot-password')}>
              Mot de passe oublié ?
            </Anchor>
          </Group>

          <Group justify="center">
            <Text size="sm">Pas encore membre ?</Text>
            <Anchor component="button" type="button" variant="subtle" onClick={() => navigate('/register')}>
              Créer un compte
            </Anchor>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Login;
