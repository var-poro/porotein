import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TextInput, Button, Stack, Text, Container, Paper, Title } from '@mantine/core';
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
    <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Paper radius="md" p="xl" withBorder w="100%">
        <Stack>
          <Title order={1}>Mot de passe oublié</Title>
          <Text>Entrez votre adresse email pour recevoir un lien de réinitialisation.</Text>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="poro@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  },
                })}
              />
              <Stack>
                <Button variant="subtle" onClick={() => navigate('/login')} fullWidth>
                  Retour à la connexion
                </Button>
                <Button type="submit" loading={forgotPasswordMutation.isLoading} fullWidth>
                  {forgotPasswordMutation.isLoading ? 'Envoi en cours...' : 'Envoyer'}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ForgotPassword; 