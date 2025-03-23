import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Stack,
  Box,
} from '@mantine/core';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      navigate('/users');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box h="100vh" display="flex" style={{ alignItems: 'center' }}>
      <Container size={420}>
        <Title>Welcome to Porotein Admin</Title>
        <Text c="dimmed" size="sm" mt={5}>
          Enter your credentials to continue
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Username"
                placeholder="Your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                mt="md"
              />
              {error && (
                <Text c="red" size="sm">
                  {error}
                </Text>
              )}
              <Button type="submit" fullWidth mt="xl">
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}; 