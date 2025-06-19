import mongoose from 'mongoose';
import * as authController from '../../src/controllers/authController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Mock the User model
jest.mock('../../src/models/User', () => {
  // Create mock functions
  const mockFindOne = jest.fn();
  const mockFindById = jest.fn();
  const mockFindByIdAndUpdate = jest.fn();
  
  // Create mock model class using type casting for Jest mocks
  const mockModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data)
  }));
  
  // Attach static methods to the model class using type casts
  mockModel.findOne = mockFindOne as jest.Mock;
  mockModel.findById = mockFindById as jest.Mock;
  mockModel.findByIdAndUpdate = mockFindByIdAndUpdate as jest.Mock;
  
  return mockModel;
});

// Mock the email transporter
jest.mock('../../src/config/email', () => {
  return {
    transporter: {
      sendMail: jest.fn().mockResolvedValue(true),
    },
    getPasswordResetEmailTemplate: jest.fn().mockReturnValue({
      subject: 'Reset Password',
      html: '<p>Reset your password</p>'
    }),
    getRegistrationEmailTemplate: jest.fn().mockReturnValue({
      subject: 'Verify Email',
      html: '<p>Verify your email</p>'
    }),
    getMagicLinkEmailTemplate: jest.fn().mockReturnValue({
      subject: 'Magic Link',
      html: '<p>Login with magic link</p>'
    }),
    config: {
      frontendUrl: 'http://localhost:3000',
      email: {
        user: 'test@example.com'
      }
    }
  };
});

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true)
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn().mockReturnValue({ userId: 'user_id' })
}));

// Mock crypto
jest.mock('crypto', () => {
  return {
    randomBytes: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('random_token')
    }),
    createHash: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnValue({
        digest: jest.fn().mockReturnValue('hashed_token')
      })
    })
  };
});

// Import the User model and mocks after defining them
import User from '../../src/models/User';
const { transporter } = require('../../src/config/email');
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Rest of your test suite continues...
}); 