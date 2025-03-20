import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration de base
export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || '',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Configuration email
  email: {
    host: process.env.EMAIL_HOST || '',
    port: Number(process.env.EMAIL_PORT) || 465,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },

  // URLs
  frontendUrl: process.env.NODE_ENV === 'production' 
    ? 'https://porotein.fr'
    : 'http://localhost:5173',
}; 