import mongoose from 'mongoose';
import * as userController from '../../src/controllers/userController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import bcrypt from 'bcryptjs';

// Mock the User model
jest.mock('../../src/models/User');

// Import the mock after defining it
import User from '../../src/models/User';

// Mock bcrypt
jest.mock('bcryptjs', () => {
  return {
    hash: jest.fn().mockResolvedValue('hashed_password'),
  };
});

// Setup mock functions
const mockUserFunctions = {
  findById: jest.fn(),
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn(),
  save: jest.fn().mockResolvedValue({})
};

// Setup populate mock
const mockPopulate = jest.fn();

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks for each test
    (User as jest.MockedFunction<any>).mockImplementation((data: any) => ({
      ...data,
      save: mockUserFunctions.save
    }));
    
    // Setup mock methods
    Object.assign(User, mockUserFunctions);
    
    // Setup chained methods
    mockUserFunctions.findById.mockReturnValue({ populate: mockPopulate });
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com'
      };

      // Mock findById to return a user
      mockPopulate.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ userId });
      const res = mockResponse();

      // Call controller method
      await userController.getCurrentUser(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(res.send).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      // Mock findById to return null
      mockPopulate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ userId: 'non_existent_user' });
      const res = mockResponse();

      // Call controller method
      await userController.getCurrentUser(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('updateCurrentUser', () => {
    it('should update the current user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const updates = {
        username: 'updateduser'
      };
      const updatedUser = {
        _id: userId,
        username: 'updateduser',
        email: 'test@example.com'
      };

      // Mock findByIdAndUpdate to return updated user
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        body: updates
      });
      const res = mockResponse();

      // Call controller method
      await userController.updateCurrentUser(req, res);

      // Assertions
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        updates,
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if user not found', async () => {
      // Mock findByIdAndUpdate to return null
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId: 'non_existent_user',
        body: { username: 'newname' }
      });
      const res = mockResponse();

      // Call controller method
      await userController.updateCurrentUser(req, res);

      // Assertions
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Mock data
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Mock findOne to return null (user doesn't exist)
      mockUserFunctions.findOne.mockResolvedValue(null);

      // Mock user save method
      mockUserFunctions.save.mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        ...userData,
        emailVerified: false,
        isActive: false
      });

      // Mock request and response
      const req = mockAuthRequest({ body: userData });
      const res = mockResponse();

      // Call controller method
      await userController.createUser(req, res);

      // Assertions
      expect(mockUserFunctions.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 8);
      expect(User).toHaveBeenCalled();
      expect(mockUserFunctions.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          username: userData.username,
          email: userData.email
        })
      }));
    });

    it('should return 409 if user already exists', async () => {
      // Mock data
      const userData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123'
      };

      // Mock findOne to return a user (user exists)
      mockUserFunctions.findOne.mockResolvedValue({ email: userData.email });

      // Mock request and response
      const req = mockAuthRequest({ body: userData });
      const res = mockResponse();

      // Call controller method
      await userController.createUser(req, res);

      // Assertions
      expect(mockUserFunctions.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.any(String)
      }));
    });
  });

  describe('getAllUsers', () => {
    it('should return all active users', async () => {
      // Mock data
      const users = [
        { _id: '1', username: 'user1', isActive: true },
        { _id: '2', username: 'user2', isActive: true }
      ];

      // Mock find to return users
      mockUserFunctions.find.mockResolvedValue(users);

      // Mock request and response
      const req = mockAuthRequest();
      const res = mockResponse();

      // Call controller method
      await userController.getAllUsers(req, res);

      // Assertions
      expect(mockUserFunctions.find).toHaveBeenCalledWith({ deleted: { $ne: true } });
      expect(res.send).toHaveBeenCalledWith(users);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com'
      };

      // Mock findById to return a user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.getUserById(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(res.send).toHaveBeenCalledWith(user);
    });

    it('should return 404 if user not found', async () => {
      // Mock findById to return null
      mockUserFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'non_existent_user' }
      });
      const res = mockResponse();

      // Call controller method
      await userController.getUserById(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should soft delete a user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const updatedUser = {
        _id: userId,
        deleted: true,
        isActive: false
      };

      // Mock findByIdAndUpdate to return updated user
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.deleteUser(req, res);

      // Assertions
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { deleted: true, isActive: false },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if user not found', async () => {
      // Mock findByIdAndUpdate to return null
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'non_existent_user' }
      });
      const res = mockResponse();

      // Call controller method
      await userController.deleteUser(req, res);

      // Assertions
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle a user active status', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        isActive: false
      };
      const updatedUser = {
        _id: userId,
        isActive: true
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);
      // Mock findByIdAndUpdate to return updated user
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.toggleUserStatus(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { isActive: true },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('restoreUser', () => {
    it('should restore a deleted user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const updatedUser = {
        _id: userId,
        deleted: false
      };

      // Mock findByIdAndUpdate to return updated user
      mockUserFunctions.findByIdAndUpdate.mockResolvedValue(updatedUser);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.restoreUser(req, res);

      // Assertions
      expect(mockUserFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        { deleted: false },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe('Weight history management', () => {
    describe('addWeight', () => {
      it('should add a weight entry', async () => {
        // Mock data
        const userId = new mongoose.Types.ObjectId().toString();
        const weightEntry = {
          weight: 75,
          date: new Date()
        };
        const user = {
          _id: userId,
          weightHistory: [],
          save: jest.fn().mockResolvedValue(true)
        };
        user.weightHistory.push = jest.fn();

        // Mock findById to return user
        mockUserFunctions.findById.mockResolvedValue(user);

        // Mock request and response
        const req = mockAuthRequest({
          userId,
          body: weightEntry
        });
        const res = mockResponse();

        // Call controller method
        await userController.addWeight(req, res);

        // Assertions
        expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
        expect(user.weightHistory.push).toHaveBeenCalledWith(expect.objectContaining({
          weight: weightEntry.weight
        }));
        expect(user.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
      });
    });

    describe('getWeightHistory', () => {
      it('should return weight history', async () => {
        // Mock data
        const userId = new mongoose.Types.ObjectId().toString();
        const weightHistory = [
          { weight: 75, date: new Date() },
          { weight: 74, date: new Date() }
        ];
        const user = {
          _id: userId,
          weightHistory
        };

        // Mock findById to return user
        mockUserFunctions.findById.mockResolvedValue(user);

        // Mock request and response
        const req = mockAuthRequest({ userId });
        const res = mockResponse();

        // Call controller method
        await userController.getWeightHistory(req, res);

        // Assertions
        expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
        expect(res.send).toHaveBeenCalledWith(weightHistory);
      });
    });

    describe('updateWeight', () => {
      it('should update a weight entry', async () => {
        // Mock data
        const userId = new mongoose.Types.ObjectId().toString();
        const entryId = new mongoose.Types.ObjectId().toString();
        const weightUpdate = {
          weight: 73,
          date: new Date()
        };

        const weightEntry = {
          _id: entryId,
          weight: 75,
          date: new Date(),
          toString: () => entryId
        };

        const user = {
          _id: userId,
          weightHistory: [weightEntry],
          save: jest.fn().mockResolvedValue(true)
        };

        // Mock findById to return user
        mockUserFunctions.findById.mockResolvedValue(user);

        // Mock request and response
        const req = mockAuthRequest({
          userId,
          params: { entryId },
          body: weightUpdate
        });
        const res = mockResponse();

        // Call controller method
        await userController.updateWeight(req, res);

        // Assertions
        expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
        expect(user.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalled();
      });
    });

    describe('deleteWeight', () => {
      it('should delete a weight entry', async () => {
        // Mock data
        const userId = new mongoose.Types.ObjectId().toString();
        const entryId = new mongoose.Types.ObjectId().toString();
        
        const weightEntry = {
          _id: {
            toString: () => entryId
          },
          weight: 75,
          date: new Date()
        };

        const user = {
          _id: userId,
          weightHistory: [weightEntry],
          save: jest.fn().mockResolvedValue(true)
        };

        // Mock findById to return user
        mockUserFunctions.findById.mockResolvedValue(user);

        // Mock request and response
        const req = mockAuthRequest({
          userId,
          params: { entryId }
        });
        const res = mockResponse();

        // Call controller method
        await userController.deleteWeight(req, res);

        // Assertions
        expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
        expect(user.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith({ message: 'Weight entry deleted' });
      });
    });
  });

  describe('resendActivationEmail', () => {
    // Mock des modules email et crypto
    jest.mock('crypto', () => ({
      randomBytes: jest.fn().mockReturnValue({ toString: jest.fn().mockReturnValue('mock_token') }),
      createHash: jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          digest: jest.fn().mockReturnValue('hashed_token')
        })
      })
    }));

    jest.mock('../../src/config/email', () => ({
      transporter: {
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test_message_id' })
      },
      getRegistrationEmailTemplate: jest.fn().mockReturnValue({
        subject: 'Test Subject',
        html: '<p>Test HTML</p>'
      })
    }));

    jest.mock('../../src/config/config', () => ({
      config: {
        frontendUrl: 'http://localhost:3000',
        email: {
          user: 'test@example.com'
        }
      }
    }));

    it('should resend activation email successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        lastActivationEmailSent: null,
        emailVerificationToken: null,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resendActivationEmail(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email d\'activation envoyé avec succès',
        lastEmailSent: expect.any(Date)
      }));
    });

    it('should return 404 if user not found', async () => {
      // Mock findById to return null
      mockUserFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'nonexistent' } });
      const res = mockResponse();

      // Call controller method
      await userController.resendActivationEmail(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
    });

    it('should return 429 if email was sent recently', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const recentDate = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
      const user = {
        _id: userId,
        lastActivationEmailSent: recentDate,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resendActivationEmail(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Un email a déjà été envoyé récemment'),
        lastEmailSent: recentDate
      }));
    });

    it('should handle email sending errors', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        lastActivationEmailSent: null,
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resendActivationEmail(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de l\'envoi de l\'email d\'activation' });
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        lastPasswordResetEmailSent: null,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resetPassword(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(user.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Email de réinitialisation envoyé avec succès',
        lastEmailSent: expect.any(Date)
      }));
    });

    it('should return 404 if user not found', async () => {
      // Mock findById to return null
      mockUserFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'nonexistent' } });
      const res = mockResponse();

      // Call controller method
      await userController.resetPassword(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith('nonexistent');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non trouvé' });
    });

    it('should return 429 if reset email was sent recently', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const recentDate = new Date(Date.now() - 2 * 60 * 1000); // 2 minutes ago
      const user = {
        _id: userId,
        lastPasswordResetEmailSent: recentDate,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resetPassword(req, res);

      // Assertions
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Un email a déjà été envoyé récemment'),
        lastEmailSent: recentDate
      }));
    });

    it('should handle password reset errors', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const user = {
        _id: userId,
        username: 'testuser',
        email: 'test@example.com',
        lastPasswordResetEmailSent: null,
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      // Mock findById to return user
      mockUserFunctions.findById.mockResolvedValue(user);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: userId } });
      const res = mockResponse();

      // Call controller method
      await userController.resetPassword(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation' });
    });
  });
}); 