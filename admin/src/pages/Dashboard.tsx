import React from 'react'
import { Container, Title, Button, Stack } from '@mantine/core'
import { useAuth } from '../context/AuthContext'

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <Container>
      <Stack>
        <Title order={1}>Tableau de bord</Title>
        <Title order={3}>Bienvenue, {user?.username}</Title>
        <Button onClick={logout} color="red">
          Se déconnecter
        </Button>
      </Stack>
    </Container>
  )
} 