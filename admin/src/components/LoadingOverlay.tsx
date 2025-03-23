import React from 'react'
import { Container, Loader } from '@mantine/core'

export const LoadingOverlay: React.FC = () => {
  return (
    <Container h="100vh" display="flex" style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <Loader size="xl" />
    </Container>
  )
} 