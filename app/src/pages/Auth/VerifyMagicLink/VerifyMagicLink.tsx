import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/apiService';
import { DecodedToken } from '@/utils/tokenUtils';
import { Container, Paper, Title, Text, Button, Stack, Loader } from '@mantine/core';

const VerifyMagicLink: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyMagicLink = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const token = searchParams.get('token');
        if (!token) {
          setError('Token de connexion manquant');
          setIsLoading(false);
          return;
        }

        console.log('Verifying token:', token);
        const response = await apiClient.post('/auth/verify-magic-link', { token });
        console.log('API Response:', response.data);

        if (!response.data.user || !response.data.accessToken) {
          throw new Error('Invalid response structure');
        }

        const user: DecodedToken = {
          userId: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };

        login(user, navigate);
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setError('Le lien de connexion est invalide ou a expiré. Veuillez en demander un nouveau.');
        setIsLoading(false);
      }
    };

    verifyMagicLink();
  }, [searchParams, navigate, login]);

  if (isLoading) {
    return (
      <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Paper radius="md" p="xl" withBorder w="100%">
          <Stack align="center">
            <Loader size="xl" />
            <Title order={2}>Vérification de votre connexion...</Title>
          </Stack>
        </Paper>
      </Container>
    );
  }

  if (isSuccess) {
    return (
      <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Paper radius="md" p="xl" withBorder w="100%">
          <Stack align="center">
            <Title order={2}>Connexion réussie !</Title>
            <Text>Vous allez être redirigé vers la page d'accueil...</Text>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder w="100%">
        <Stack align="center">
          <Title order={2}>Erreur de connexion</Title>
          {error && <Text c="red">{error}</Text>}
          <Button onClick={() => navigate('/login')} fullWidth>
            Retour à la connexion
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default VerifyMagicLink; 