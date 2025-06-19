import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  userId?: string;
}

// Crée un mock de la requête authentifiée
export function mockAuthRequest(overrides: Partial<AuthRequest> = {}): AuthRequest {
  const userId = overrides.userId || new mongoose.Types.ObjectId().toString();
  
  return {
    userId,
    headers: {
      authorization: `Bearer test-token-${userId}`,
      ...overrides.headers,
    },
    body: overrides.body || {},
    params: overrides.params || {},
    query: overrides.query || {},
    ...overrides
  } as AuthRequest;
}

// Crée un mock de la réponse
export function mockResponse(): Response {
  const res: Partial<Response> = {};
  
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  
  return res as Response;
}

// Mock pour le middleware d'authentification
export const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  (req as AuthRequest).userId = new mongoose.Types.ObjectId().toString();
  next();
}; 