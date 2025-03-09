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
import notificationRoutes from './routes/notificationRoutes';
import pushRoutes from './routes/pushRoutes';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "node:path";
import weightRoutes from './routes/weightRoutes';

dotenv.config();

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

// Connect to the database
connectDB();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
app.use('/notifications', notificationRoutes);
app.use('/push', pushRoutes);
app.use('/api/weight', weightRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});