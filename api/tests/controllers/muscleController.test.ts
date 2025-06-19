import mongoose from 'mongoose';
import * as muscleController from '../../src/controllers/muscleController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import { createModelMock, setupModelMock } from '../mocks/mongoose.mock';

// Mock the model with specific mock implementation
jest.mock('../../src/models/Muscle');

// Import the mocked model
import Muscle from '../../src/models/Muscle';

// Create mock for Muscle model
const muscleMock = createModelMock('Muscle');
const mockMuscleFunctions = muscleMock.mockFunctions;

describe('Muscle Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock for each test
    (Muscle as jest.MockedFunction<any>).mockImplementation((data: any) => ({
      ...data,
      _id: new mongoose.Types.ObjectId(),
      save: mockMuscleFunctions.save
    }));
    
    // Assign mock functions to the model
    Object.assign(Muscle, mockMuscleFunctions);
  });

  describe('createMuscle', () => {
    it('should create a muscle successfully', async () => {
      // Mock data
      const muscleData = {
        name: 'Biceps',
        bodyPart: 'Arms'
      };

      // Mock request and response
      const req = mockAuthRequest({ body: muscleData });
      const res = mockResponse();

      // Mock save method
      mockMuscleFunctions.save.mockResolvedValue({
        ...muscleData,
        _id: new mongoose.Types.ObjectId()
      });

      // Call controller method
      await muscleController.createMuscle(req, res);

      // Assertions
      expect(Muscle).toHaveBeenCalledWith(muscleData);
      expect(mockMuscleFunctions.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining(muscleData));
    });

    it('should handle errors when creating a muscle', async () => {
      // Mock data
      const muscleData = { name: 'Invalid Muscle' };

      // Mock request and response
      const req = mockAuthRequest({ body: muscleData });
      const res = mockResponse();

      // Mock save method to throw an error
      mockMuscleFunctions.save.mockRejectedValue(new Error('Validation error'));

      // Call controller method
      await muscleController.createMuscle(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getMuscle', () => {
    it('should get a muscle by ID', async () => {
      // Mock data
      const muscleId = new mongoose.Types.ObjectId().toString();
      const muscle = {
        _id: muscleId,
        name: 'Biceps',
        bodyPart: 'Arms'
      };

      // Mock findById
      mockMuscleFunctions.findById.mockResolvedValue(muscle);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: muscleId } });
      const res = mockResponse();

      // Call controller method
      await muscleController.getMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findById).toHaveBeenCalledWith(muscleId);
      expect(res.send).toHaveBeenCalledWith(muscle);
    });

    it('should return 404 if muscle not found', async () => {
      // Mock findById to return null
      mockMuscleFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'non_existent_id' } });
      const res = mockResponse();

      // Call controller method
      await muscleController.getMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle database errors when getting muscle', async () => {
      // Mock findById to throw an error
      mockMuscleFunctions.findById.mockRejectedValue(new Error('Database error'));

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'muscle1' } });
      const res = mockResponse();

      // Call controller method
      await muscleController.getMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('updateMuscle', () => {
    it('should update a muscle by ID', async () => {
      // Mock data
      const muscleId = new mongoose.Types.ObjectId().toString();
      const updatedMuscle = {
        _id: muscleId,
        name: 'Updated Muscle',
        bodyPart: 'Updated Body Part'
      };

      // Mock findByIdAndUpdate
      mockMuscleFunctions.findByIdAndUpdate.mockResolvedValue(updatedMuscle);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: muscleId },
        body: { name: 'Updated Muscle', bodyPart: 'Updated Body Part' }
      });
      const res = mockResponse();

      // Call controller method
      await muscleController.updateMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        muscleId,
        { name: 'Updated Muscle', bodyPart: 'Updated Body Part' },
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedMuscle);
    });

    it('should return 404 if muscle to update not found', async () => {
      // Mock findByIdAndUpdate to return null
      mockMuscleFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'non_existent_id' },
        body: { name: 'Updated Muscle' }
      });
      const res = mockResponse();

      // Call controller method
      await muscleController.updateMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      // Mock findByIdAndUpdate to throw an error
      mockMuscleFunctions.findByIdAndUpdate.mockRejectedValue(new Error('Update error'));

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'muscle1' },
        body: { name: 'Updated Muscle' }
      });
      const res = mockResponse();

      // Call controller method
      await muscleController.updateMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteMuscle', () => {
    it('should delete a muscle by ID', async () => {
      // Mock data
      const muscleId = new mongoose.Types.ObjectId().toString();
      const deletedMuscle = {
        _id: muscleId,
        name: 'Muscle to Delete',
        bodyPart: 'Arms'
      };

      // Mock findByIdAndDelete
      mockMuscleFunctions.findByIdAndDelete.mockResolvedValue(deletedMuscle);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: muscleId } });
      const res = mockResponse();

      // Call controller method
      await muscleController.deleteMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndDelete).toHaveBeenCalledWith(muscleId);
      expect(res.send).toHaveBeenCalledWith(deletedMuscle);
    });

    it('should return 404 if muscle to delete not found', async () => {
      // Mock findByIdAndDelete to return null
      mockMuscleFunctions.findByIdAndDelete.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'non_existent_id' } });
      const res = mockResponse();

      // Call controller method
      await muscleController.deleteMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      // Mock findByIdAndDelete to throw an error
      mockMuscleFunctions.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'muscle1' } });
      const res = mockResponse();

      // Call controller method
      await muscleController.deleteMuscle(req, res);

      // Assertions
      expect(mockMuscleFunctions.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAllMuscles', () => {
    it('should return all muscles', async () => {
      // Mock data
      const muscles = [
        { _id: '1', name: 'Biceps', bodyPart: 'Arms' },
        { _id: '2', name: 'Quadriceps', bodyPart: 'Legs' }
      ];

      // Mock find
      mockMuscleFunctions.find.mockResolvedValue(muscles);

      // Mock request and response
      const req = mockAuthRequest();
      const res = mockResponse();

      // Call controller method
      await muscleController.getAllMuscles(req, res);

      // Assertions
      expect(mockMuscleFunctions.find).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(muscles);
    });

    it('should handle errors when retrieving muscles', async () => {
      // Mock find to throw an error
      mockMuscleFunctions.find.mockRejectedValue(new Error('Database error'));

      // Mock request and response
      const req = mockAuthRequest();
      const res = mockResponse();

      // Call controller method
      await muscleController.getAllMuscles(req, res);

      // Assertions
      expect(mockMuscleFunctions.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });
}); 