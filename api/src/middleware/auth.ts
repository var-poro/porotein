import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import User from '../models/User';

export interface AuthRequest extends Request {
    userId: string;
    userRole?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error();
        }

        req.userId = user._id.toString();
        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Veuillez vous authentifier.' });
    }
};

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Accès non autorisé. Droits d\'administrateur requis.' });
        }
        next();
    } catch (error) {
        res.status(403).json({ message: 'Accès non autorisé.' });
    }
};