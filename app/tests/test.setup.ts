import { test as setup } from '@playwright/test';
import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:4000';

setup('create test user', async () => {
  try {
    // Créer l'utilisateur de test
    await axios.post(`${API_URL}/auth/register`, {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123'
    });

    // Activer l'utilisateur directement
    await axios.post(`${API_URL}/auth/verify-email`, {
      token: 'test-token' // Le token n'est pas important car nous activons directement l'utilisateur
    });
  } catch (error) {
    // Ignorer l'erreur si l'utilisateur existe déjà
    if (axios.isAxiosError(error) && error.response?.status !== 409) {
      throw error;
    }
  }
}); 