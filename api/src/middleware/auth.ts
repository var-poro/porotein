import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from "jsonwebtoken";
import User from '../models/User';

export interface AuthRequest extends Request {
    userId: string;
    userRole?: string;
}

export const auth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    return (async () => {
        try {
            const token = authReq.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                throw new Error();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
            const user = await User.findById(decoded.userId);

            if (!user) {
                throw new Error();
            }

            authReq.userId = user._id.toString();
            authReq.userRole = user.role;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Veuillez vous authentifier.' });
        }
    })();
};

export const isAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    return (async () => {
        try {
            if (authReq.userRole !== 'admin') {
                res.status(403).json({ message: 'Accès non autorisé. Droits d\'administrateur requis.' });
                return;
            }
            next();
        } catch (error) {
            res.status(403).json({ message: 'Accès non autorisé.' });
        }
    })();
};