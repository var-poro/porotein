import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRegister } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Stack, Text, Container, Paper, Title, Group, Anchor } from '@mantine/core';

interface RegisterFormInputs {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
    const registerMutation = useRegister();
    const navigate = useNavigate();
    const [isRegistered, setIsRegistered] = useState(false);

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        try {
            await registerMutation.mutateAsync(data);
            setIsRegistered(true);
        } catch (error) {
            console.error('Registration failed', error);
        }
    };

    if (isRegistered) {
        return (
            <Container size="xs" h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Paper radius="md" p="xl" withBorder w="100%">
                    <Stack>
                        <Title order={1}>Inscription réussie !</Title>
                        <Text>Un email de confirmation a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.</Text>
                        <Button variant="subtle" onClick={() => navigate('/login')} fullWidth>
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
                    <Title order={1}>Créer un compte</Title>
                    
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack>
                            <TextInput
                                label="Nom d'utilisateur"
                                placeholder="poro"
                                error={errors.username?.message}
                                {...register('username', { required: 'Ce champ est obligatoire' })}
                            />
                            <TextInput
                                label="Email"
                                placeholder="poro@example.com"
                                error={errors.email?.message}
                                {...register('email', {
                                    required: 'Ce champ est obligatoire',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Adresse email invalide',
                                    },
                                })}
                            />
                            <PasswordInput
                                label="Mot de passe"
                                placeholder="********"
                                error={errors.password?.message}
                                {...register('password', { required: 'Ce champ est obligatoire' })}
                            />
                            <Button type="submit" loading={registerMutation.isLoading} fullWidth>
                                {registerMutation.isLoading ? 'Inscription...' : 'S\'inscrire'}
                            </Button>
                        </Stack>
                    </form>

                    <Group justify="center">
                        <Text size="sm">Déjà un compte ?</Text>
                        <Anchor component="button" type="button" variant="subtle" onClick={() => navigate('/login')}>
                            Connecte-toi
                        </Anchor>
                    </Group>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Register;