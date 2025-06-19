import mongoose from 'mongoose';
import * as sessionController from '../../src/controllers/sessionController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import { createModelMock, setupModelMock } from '../mocks/mongoose.mock';

// Mock the models
jest.mock('../../src/models/Session');
jest.mock('../../src/models/Exercise');
jest.mock('../../src/models/Program');

// Import mocked models
import Session from '../../src/models/Session';
import Exercise from '../../src/models/Exercise';
import Program from '../../src/models/Program';

// Create mocks for models
const sessionMock = createModelMock('Session');
const exerciseMock = createModelMock('Exercise');
const programMock = createModelMock('Program');

// Get mock functions
const mockSessionFunctions = sessionMock.mockFunctions;
const mockExerciseFunctions = exerciseMock.mockFunctions;
const mockProgramFunctions = programMock.mockFunctions;

describe('Session Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks for each test
    (Session as jest.MockedFunction<any>).mockImplementation((data: any) => ({
      ...data,
      _id: new mongoose.Types.ObjectId(),
      save: mockSessionFunctions.save
    }));
    Object.assign(Session, mockSessionFunctions);
    
    (Exercise as jest.MockedFunction<any>).mockImplementation((data: any) => ({
      ...data,
      _id: new mongoose.Types.ObjectId(),
      save: mockExerciseFunctions.save
    }));
    Object.assign(Exercise, mockExerciseFunctions);
    
    (Program as jest.MockedFunction<any>).mockImplementation((data: any) => ({
      ...data,
      _id: new mongoose.Types.ObjectId(),
      save: mockProgramFunctions.save
    }));
    Object.assign(Program, mockProgramFunctions);
  });

  describe('createSession', () => {
    it('should create a session successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const programId = new mongoose.Types.ObjectId().toString();
      const sessionData = {
        name: 'Test Session',
        programId,
        exercises: []
      };
      
      const savedSession = {
        _id: new mongoose.Types.ObjectId(),
        ...sessionData,
        userId
      };

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        body: sessionData
      });
      const res = mockResponse();
      
      // Mock save method
      mockSessionFunctions.save.mockResolvedValue(savedSession);

      // Call controller method
      await sessionController.createSession(req, res);

      // Assertions
      expect(Session).toHaveBeenCalledWith({ 
        ...sessionData,
        userId
      });
      expect(mockSessionFunctions.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(savedSession);
    });

    it('should handle errors when creating a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionData = {
        name: 'Test Session',
        // Missing required fields
      };

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        body: sessionData
      });
      const res = mockResponse();
      
      // Mock save to throw an error
      mockSessionFunctions.save.mockRejectedValue(new Error('Validation error'));

      // Call controller method
      await sessionController.createSession(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('should get a session by id', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const session = {
        _id: sessionId,
        name: 'Test Session',
        userId
      };

      // Mock findOne and populate
      const mockPopulate = jest.fn().mockResolvedValue(session);
      mockSessionFunctions.findOne.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.getSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOne).toHaveBeenCalledWith({ _id: sessionId, userId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.send).toHaveBeenCalledWith(session);
    });

    it('should return 404 if session not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();

      // Mock findOne and populate
      const mockPopulate = jest.fn().mockResolvedValue(null);
      mockSessionFunctions.findOne.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.getSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOne).toHaveBeenCalledWith({ _id: sessionId, userId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when getting a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();

      // Mock findOne and populate to throw error
      const mockPopulate = jest.fn().mockRejectedValue(new Error('Database error'));
      mockSessionFunctions.findOne.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({ 
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.getSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOne).toHaveBeenCalledWith({ _id: sessionId, userId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('updateSession', () => {
    it('should update a session successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Session'
      };
      const updatedSession = {
        _id: sessionId,
        name: 'Updated Session',
        userId
      };

      // Mock findOneAndUpdate
      mockSessionFunctions.findOneAndUpdate.mockResolvedValue(updatedSession);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: sessionId, userId },
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedSession);
    });

    it('should return 404 if session to update not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Session'
      };

      // Mock findOneAndUpdate
      mockSessionFunctions.findOneAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when updating a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Session'
      };

      // Mock findOneAndUpdate to throw error
      mockSessionFunctions.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteSession', () => {
    it('should delete a session successfully', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const session = {
        _id: sessionId,
        name: 'Test Session',
        userId
      };

      // Mock findOneAndDelete
      mockSessionFunctions.findOneAndDelete.mockResolvedValue(session);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndDelete).toHaveBeenCalledWith({ _id: sessionId, userId });
      expect(res.send).toHaveBeenCalledWith(session);
    });

    it('should return 404 if session to delete not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();

      // Mock findOneAndDelete
      mockSessionFunctions.findOneAndDelete.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when deleting a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();

      // Mock findOneAndDelete to throw error
      mockSessionFunctions.findOneAndDelete.mockRejectedValue(new Error('Delete failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findOneAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAllSessions', () => {
    it('should get all sessions for a user', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessions = [
        { _id: '1', name: 'Session 1', userId },
        { _id: '2', name: 'Session 2', userId }
      ];

      // Mock find and populate
      const mockPopulate = jest.fn().mockResolvedValue(sessions);
      mockSessionFunctions.find.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({ userId });
      const res = mockResponse();

      // Call controller method
      await sessionController.getAllSessions(req, res);

      // Assertions
      expect(mockSessionFunctions.find).toHaveBeenCalledWith({ userId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.send).toHaveBeenCalledWith(sessions);
    });

    it('should handle errors when getting all sessions', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();

      // Mock find and populate to throw error
      const mockPopulate = jest.fn().mockRejectedValue(new Error('Find failed'));
      mockSessionFunctions.find.mockReturnValue({ populate: mockPopulate });

      // Mock request and response
      const req = mockAuthRequest({ userId });
      const res = mockResponse();

      // Call controller method
      await sessionController.getAllSessions(req, res);

      // Assertions
      expect(mockSessionFunctions.find).toHaveBeenCalledWith({ userId });
      expect(mockPopulate).toHaveBeenCalledWith('exercises');
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('createExerciseInSession', () => {
    it('should add an exercise to a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const exercise = {
        _id: exerciseId,
        name: 'Test Exercise',
        userId
      };
      const updatedSession = {
        _id: sessionId,
        name: 'Test Session',
        exercises: [exerciseId],
        userId
      };

      // Mock Exercise.findById
      mockExerciseFunctions.findById.mockResolvedValue(exercise);
      
      // Mock Session.findByIdAndUpdate
      mockSessionFunctions.findByIdAndUpdate.mockResolvedValue(updatedSession);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.createExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findById).toHaveBeenCalledWith(exerciseId);
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        sessionId,
        { $addToSet: { exercises: exerciseId } },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedSession);
    });

    it('should return 404 if exercise not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();

      // Mock Exercise.findById
      mockExerciseFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.createExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findById).toHaveBeenCalledWith(exerciseId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when adding an exercise', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const exercise = {
        _id: exerciseId,
        name: 'Test Exercise',
        userId
      };

      // Mock Exercise.findById
      mockExerciseFunctions.findById.mockResolvedValue(exercise);
      
      // Mock Session.findByIdAndUpdate to throw error
      mockSessionFunctions.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.createExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findById).toHaveBeenCalledWith(exerciseId);
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if session not found when adding exercise', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const exercise = {
        _id: exerciseId,
        name: 'Test Exercise',
        userId
      };

      // Mock Exercise.findById
      mockExerciseFunctions.findById.mockResolvedValue(exercise);
      
      // Mock Session.findByIdAndUpdate to return null (session not found)
      mockSessionFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.createExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findById).toHaveBeenCalledWith(exerciseId);
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Session not found');
    });
  });

  describe('updateExerciseInSession', () => {
    it('should update an exercise in a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Exercise' };
      const updatedExercise = {
        _id: exerciseId,
        name: 'Updated Exercise',
        userId
      };

      // Mock Exercise.findByIdAndUpdate
      mockExerciseFunctions.findByIdAndUpdate.mockResolvedValue(updatedExercise);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        exerciseId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedExercise);
    });

    it('should return 404 if exercise not found when updating', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Exercise' };

      // Mock Exercise.findByIdAndUpdate to return null
      mockExerciseFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        exerciseId,
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Exercise not found');
    });

    it('should handle errors when updating exercise in session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Exercise' };

      // Mock Exercise.findByIdAndUpdate to throw error
      mockExerciseFunctions.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId },
        body: updateData
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.updateExerciseInSession(req, res);

      // Assertions
      expect(mockExerciseFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteExerciseFromSession', () => {
    it('should remove an exercise from a session', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const updatedSession = {
        _id: sessionId,
        name: 'Test Session',
        exercises: [],
        userId
      };

      // Mock Session.findByIdAndUpdate
      mockSessionFunctions.findByIdAndUpdate.mockResolvedValue(updatedSession);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteExerciseFromSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        sessionId,
        { $pull: { exercises: exerciseId } },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedSession);
    });

    it('should return 404 if session not found', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();

      // Mock Session.findByIdAndUpdate
      mockSessionFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteExerciseFromSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle errors when removing an exercise', async () => {
      // Mock data
      const userId = new mongoose.Types.ObjectId().toString();
      const sessionId = new mongoose.Types.ObjectId().toString();
      const exerciseId = new mongoose.Types.ObjectId().toString();

      // Mock Session.findByIdAndUpdate to throw error
      mockSessionFunctions.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

      // Mock request and response
      const req = mockAuthRequest({
        userId,
        params: { id: sessionId, exerciseId }
      });
      const res = mockResponse();

      // Call controller method
      await sessionController.deleteExerciseFromSession(req, res);

      // Assertions
      expect(mockSessionFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
