import mongoose from 'mongoose';
import * as programController from '../../src/controllers/programController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import { createModelMock, setupModelMock } from '../mocks/mongoose.mock';

// Mock the models
jest.mock('../../src/models/Program');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Session');

// Import mocked models
import Program from '../../src/models/Program';
import User from '../../src/models/User';
import Session from '../../src/models/Session';

// Create mocks for models
const programMock = createModelMock('Program');
const userMock = createModelMock('User');
const sessionMock = createModelMock('Session');

// Get mock functions
const mockProgramFunctions = programMock.mockFunctions;
const mockUserFunctions = userMock.mockFunctions;
const mockSessionFunctions = sessionMock.mockFunctions;

describe('Program Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks for each test
    (Program as jest.MockedFunction<any>).mockImplementation(programMock.mockConstructor);
    Object.assign(Program, mockProgramFunctions);
    
    (User as jest.MockedFunction<any>).mockImplementation(userMock.mockConstructor);
    Object.assign(User, mockUserFunctions);
    
    (Session as jest.MockedFunction<any>).mockImplementation(sessionMock.mockConstructor);
    Object.assign(Session, mockSessionFunctions);
  });

  describe('createProgram', () => {
    it('should create a program successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programData = {
        name: 'Test Program',
        description: 'A test program description'
      };

      const mockUser = {
        _id: userId,
        activeProgram: null,
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock User.findById
      mockUserFunctions.findById.mockResolvedValue(mockUser);
      
      // Mock program save
      const savedProgram = {
        ...programData,
        userId,
        _id: new mongoose.Types.ObjectId()
      };
      
      // Create a specific mock instance for this test
      const mockProgramInstance = {
        ...programData,
        userId,
        _id: new mongoose.Types.ObjectId(),
        save: jest.fn().mockResolvedValue(savedProgram)
      };
      
      // Override the default mock implementation for this test
      (Program as jest.MockedFunction<any>).mockReturnValueOnce(mockProgramInstance);

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        body: programData
      });
      const res = mockResponse();

      // Call the controller
      await programController.createProgram(req, res);

      // Assertions
      expect(Program).toHaveBeenCalledWith({ 
        ...programData,
        userId
      });
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should create a program without setting as active program if user already has one', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programData = {
        name: 'Test Program',
        description: 'A test program description'
      };

      const mockUser = {
        _id: userId,
        activeProgram: new mongoose.Types.ObjectId(), // User already has an active program
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock User.findById
      mockUserFunctions.findById.mockResolvedValue(mockUser);
      
      // Mock program save
      const savedProgram = {
        ...programData,
        userId,
        _id: new mongoose.Types.ObjectId()
      };
      
      // Create a specific mock instance for this test
      const mockProgramInstance = {
        ...programData,
        userId,
        _id: new mongoose.Types.ObjectId(),
        save: jest.fn().mockResolvedValue(savedProgram)
      };
      
      // Override the default mock implementation for this test
      (Program as jest.MockedFunction<any>).mockReturnValueOnce(mockProgramInstance);

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        body: programData
      });
      const res = mockResponse();

      // Call the controller
      await programController.createProgram(req, res);

      // Assertions
      expect(Program).toHaveBeenCalledWith({ 
        ...programData,
        userId
      });
      expect(mockUserFunctions.findById).toHaveBeenCalledWith(userId);
      expect(mockUser.save).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when creating a program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programData = {
        name: 'Test Program',
        description: 'A test program description'
      };

      // Mock Program to throw an error
      const mockError = new Error('Failed to create program');
      (Program as jest.MockedFunction<any>).mockImplementationOnce(() => {
        throw mockError;
      });

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        body: programData
      });
      const res = mockResponse();

      // Call the controller
      await programController.createProgram(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ error: mockError.message });
    });
  });

  describe('getProgram', () => {
    it('should get a program by id', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const program = {
        _id: programId,
        name: 'Test Program',
        description: 'A test program',
        userId
      };

      // Mock Program.findOne
      mockProgramFunctions.findOne.mockResolvedValue(program);

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOne).toHaveBeenCalledWith({ _id: programId, userId });
      expect(res.send).toHaveBeenCalledWith(program);
    });

    it('should return 404 if program not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();

      // Mock Program.findOne
      mockProgramFunctions.findOne.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOne).toHaveBeenCalledWith({ _id: programId, userId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when getting a program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      
      // Mock Program.findOne to throw error
      mockProgramFunctions.findOne.mockRejectedValue(new Error('Database error'));

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOne).toHaveBeenCalledWith({ _id: programId, userId });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('updateProgram', () => {
    it('should update a program successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Program',
        description: 'Updated description'
      };
      const updatedProgram = {
        _id: programId,
        ...updateData,
        userId
      };

      // Mock Program.findOneAndUpdate
      mockProgramFunctions.findOneAndUpdate.mockResolvedValue(updatedProgram);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId },
        body: updateData
      });
      const res = mockResponse();

      // Call the controller
      await programController.updateProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: programId, userId },
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedProgram);
    });

    it('should return 404 if program to update not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Program'
      };

      // Mock Program.findOneAndUpdate
      mockProgramFunctions.findOneAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId },
        body: updateData
      });
      const res = mockResponse();

      // Call the controller
      await programController.updateProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when updating a program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Program'
      };

      // Mock Program.findOneAndUpdate to throw error
      mockProgramFunctions.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId },
        body: updateData
      });
      const res = mockResponse();

      // Call the controller
      await programController.updateProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteProgram', () => {
    it('should delete a program successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const program = {
        _id: programId,
        name: 'Test Program',
        userId
      };

      // Mock Program.findOneAndDelete
      mockProgramFunctions.findOneAndDelete.mockResolvedValue(program);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.deleteProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndDelete).toHaveBeenCalledWith({ _id: programId, userId });
      expect(res.send).toHaveBeenCalledWith(program);
    });

    it('should return 404 if program to delete not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();

      // Mock Program.findOneAndDelete
      mockProgramFunctions.findOneAndDelete.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.deleteProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndDelete).toHaveBeenCalledWith({ _id: programId, userId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when deleting a program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();

      // Mock Program.findOneAndDelete to throw error
      mockProgramFunctions.findOneAndDelete.mockRejectedValue(new Error('Delete failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.deleteProgram(req, res);

      // Assertions
      expect(mockProgramFunctions.findOneAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAllPrograms', () => {
    it('should get all programs for a user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programs = [
        { _id: '1', name: 'Program 1', userId },
        { _id: '2', name: 'Program 2', userId }
      ];

      // Mock Program.find
      mockProgramFunctions.find.mockResolvedValue(programs);

      // Mock request and response
      const req = mockAuthRequest({ userId });
      const res = mockResponse();

      // Call the controller
      await programController.getAllPrograms(req, res);

      // Assertions
      expect(mockProgramFunctions.find).toHaveBeenCalledWith({ userId });
      expect(res.send).toHaveBeenCalledWith(programs);
    });

    it('should handle errors when getting all programs', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();

      // Mock Program.find to throw error
      mockProgramFunctions.find.mockRejectedValue(new Error('Find failed'));

      // Mock request and response
      const req = mockAuthRequest({ userId });
      const res = mockResponse();

      // Call the controller
      await programController.getAllPrograms(req, res);

      // Assertions
      expect(mockProgramFunctions.find).toHaveBeenCalledWith({ userId });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getSessionsByProgramId', () => {
    it('should get all sessions for a program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const sessions = [
        { _id: '1', name: 'Session 1', programId },
        { _id: '2', name: 'Session 2', programId }
      ];

      // Mock Session.find
      const mockPopulate = jest.fn().mockResolvedValue(sessions);
      mockSessionFunctions.find.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getSessionsByProgramId(req, res);

      // Assertions
      expect(mockSessionFunctions.find).toHaveBeenCalledWith({ programId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(sessions);
    });

    it('should return 404 if no sessions found for program', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();

      // Mock Session.find
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockSessionFunctions.find.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getSessionsByProgramId(req, res);

      // Assertions
      expect(mockSessionFunctions.find).toHaveBeenCalledWith({ programId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No sessions found for this program' });
    });

    it('should handle errors when getting sessions', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();

      // Mock Session.find to throw error
      const mockPopulate = jest.fn().mockRejectedValue(new Error('Find failed'));
      mockSessionFunctions.find.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { programId }
      });
      const res = mockResponse();

      // Call the controller
      await programController.getSessionsByProgramId(req, res);

      // Assertions
      expect(mockSessionFunctions.find).toHaveBeenCalledWith({ programId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Error fetching sessions'
      }));
    });
  });
}); 