import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    userId?: string;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid token' });
    }
};