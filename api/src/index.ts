import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import sessionRoutes from './routes/sessionRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import savedSessionRoutes from "./routes/savedSessionRoutes";
import savedExerciseRoutes from "./routes/savedExerciseRoutes";
import supplementRoutes from './routes/supplementRoutes';
import userRoutes from './routes/userRoutes';
import programRoutes from './routes/programRoutes';
import tagRoutes from './routes/tagRoutes';
import muscleRoutes from './routes/muscleRoutes';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "node:path";
import weightRoutes from './routes/weightRoutes';
import swaggerSpec from './config/swagger';
import fs from 'fs';

try {
    // Résolution du chemin du fichier .env
    const envPath = path.join(process.cwd(), '.env');
    console.log('Tentative de chargement du fichier .env depuis:', envPath);
    console.log('Répertoire courant:', process.cwd());
    console.log('Contenu du répertoire:', require('fs').readdirSync(process.cwd()));

    // Charger les variables d'environnement depuis le fichier .env
    const result = dotenv.config({ path: envPath });

    if (result.error) {
        console.error('Erreur détaillée lors du chargement du fichier .env:', {
            error: result.error.message,
            stack: result.error.stack,
            path: envPath
        });
        process.exit(1);
    }

    console.log('Variables d\'environnement chargées avec succès');
    console.log('Variables disponibles:', {
        jwtSecret: !!process.env.JWT_SECRET,
        jwtRefreshSecret: !!process.env.JWT_REFRESH_SECRET
    });

    // Vérifier les variables d'environnement requises
    const requiredEnvVars = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`La variable d'environnement ${envVar} n'est pas définie`);
            process.exit(1);
        }
    }

    const app = express();
    const PORT = process.env.PORT || 4000;

    // Middleware CORS
    const corsOptions = {
        origin: ['http://localhost:4173', "http://192.168.1.112:5173/", "http://192.168.1.67:5173", 'http://localhost:5173', 'https://porotein.fr'],
        credentials: true,
    };
    app.use(cors(corsOptions));

    // Middleware pour analyser les corps de requêtes JSON
    app.use(express.json());

    // Middleware pour analyser les corps de requêtes URL-encodées
    app.use(express.urlencoded({extended: true}));

    // Middleware pour parser les cookies
    app.use(cookieParser());

    // Servir les fichiers statiques du dossier public
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Connect to the database
    connectDB();

    // Swagger Documentation JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // Route pour la documentation Swagger personnalisée
    app.get('/api-docs', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'swagger.html'));
    });

    // Routes
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });

    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/sessions', sessionRoutes);
    app.use('/exercises', exerciseRoutes);
    app.use('/saved-sessions', savedSessionRoutes);
    app.use('/saved-exercises', savedExerciseRoutes);
    app.use('/supplements', supplementRoutes);
    app.use('/programs', programRoutes);
    app.use('/tags', tagRoutes);
    app.use('/muscles', muscleRoutes);
    app.use('/api/weight', weightRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
} catch (error: any) {
    console.error('Erreur critique lors du démarrage du serveur:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
    });
    process.exit(1);
}