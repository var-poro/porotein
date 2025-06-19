import mongoose from 'mongoose';
import { auth, isAdmin } from '../../src/middleware/auth';
import jwt from 'jsonwebtoken';

// Mock User model
jest.mock('../../src/models/User', () => {
  return {
    findById: jest.fn(),
  };
});

const User = require('../../src/models/User');

describe('Auth Middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('auth middleware', () => {
    it('should authenticate valid token and set userId', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const token = 'valid_token';
      const user = {
        _id: {
          toString: () => userId
        },
        role: 'user'
      };

      // Setup mocks
      req.header.mockReturnValue(`Bearer ${token}`);
      jwt.verify = jest.fn().mockReturnValue({ userId });
      User.findById.mockResolvedValue(user);

      // Execute middleware
      await auth(req, res, next);

      // Assertions
      expect(req.header).toHaveBeenCalledWith('Authorization');
      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(req.userId).toBe(userId);
      expect(req.userRole).toBe('user');
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      // Setup mocks
      req.header.mockReturnValue(undefined);

      // Execute middleware
      await auth(req, res, next);

      // Assertions
      expect(req.header).toHaveBeenCalledWith('Authorization');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Veuillez vous authentifier.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token verification fails', async () => {
      // Setup mocks
      req.header.mockReturnValue('Bearer invalid_token');
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Execute middleware
      await auth(req, res, next);

      // Assertions
      expect(jwt.verify).toThrow();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Veuillez vous authentifier.' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user not found', async () => {
      // Setup mocks
      req.header.mockReturnValue('Bearer valid_token');
      jwt.verify = jest.fn().mockReturnValue({ userId: 'non_existent_user' });
      User.findById.mockResolvedValue(null);

      // Execute middleware
      await auth(req, res, next);

      // Assertions
      expect(User.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Veuillez vous authentifier.' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin middleware', () => {
    it('should allow admin user to proceed', async () => {
      // Setup mock request with admin role
      req.userRole = 'admin';

      // Execute middleware
      await isAdmin(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 for non-admin user', async () => {
      // Setup mock request with non-admin role
      req.userRole = 'user';

      // Execute middleware
      await isAdmin(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ 
        message: 'Accès non autorisé. Droits d\'administrateur requis.' 
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors and return 403', async () => {
      // Setup mock request to throw error
      req = {}; // No userRole will cause error when accessing userRole

      // Execute middleware
      await isAdmin(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Accès non autorisé. Droits d\'administrateur requis.' });
      expect(next).not.toHaveBeenCalled();
    });
  });
}); 