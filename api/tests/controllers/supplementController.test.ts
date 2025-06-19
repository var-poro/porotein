import { Request, Response } from 'express';
import * as supplementController from '../../src/controllers/supplementController';
import Supplement from '../../src/models/Supplement';
import mongoose from 'mongoose';

// Mock du modèle Supplement
jest.mock('../../src/models/Supplement');

const mockSupplement = Supplement as jest.Mocked<typeof Supplement>;

interface AuthRequest extends Request {
  userId?: string;
}

// Helper pour créer un mock de Request avec userId
const mockAuthRequest = (overrides = {}) => ({
  userId: 'user-id-123',
  params: {},
  body: {},
  ...overrides,
}) as AuthRequest;

// Helper pour créer un mock de Response
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe('Supplement Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSupplement', () => {
    it('should create a supplement successfully', async () => {
      const supplementData = {
        name: 'Test Supplement',
        description: 'Test description',
        dosage: '1 tablet daily'
      };

      const mockSupplementInstance = {
        _id: 'supplement-id',
        ...supplementData,
        userId: 'user-id-123',
        save: jest.fn().mockResolvedValue(true)
      };

      // Mock constructor
      (Supplement as any).mockImplementation(() => mockSupplementInstance);

      const req = mockAuthRequest({ body: supplementData });
      const res = mockResponse();

      await supplementController.createSupplement(req, res);

      expect(Supplement).toHaveBeenCalledWith({
        ...supplementData,
        userId: 'user-id-123'
      });
      expect(mockSupplementInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockSupplementInstance);
    });

    it('should handle errors when creating a supplement', async () => {
      const supplementData = {
        name: 'Test Supplement'
      };

      const mockSupplementInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      (Supplement as any).mockImplementation(() => mockSupplementInstance);

      const req = mockAuthRequest({ body: supplementData });
      const res = mockResponse();

      await supplementController.createSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getSupplement', () => {
    it('should get a supplement by ID', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();
      const supplement = {
        _id: supplementId,
        name: 'Test Supplement',
        userId: 'user-id-123'
      };

      mockSupplement.findOne.mockResolvedValue(supplement as any);

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.getSupplement(req, res);

      expect(mockSupplement.findOne).toHaveBeenCalledWith({ 
        _id: supplementId, 
        userId: 'user-id-123' 
      });
      expect(res.send).toHaveBeenCalledWith(supplement);
    });

    it('should return 404 if supplement not found', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();

      mockSupplement.findOne.mockResolvedValue(null);

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.getSupplement(req, res);

      expect(mockSupplement.findOne).toHaveBeenCalledWith({ 
        _id: supplementId, 
        userId: 'user-id-123' 
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should handle database errors when getting supplement', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();

      mockSupplement.findOne.mockRejectedValue(new Error('Database error'));

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.getSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateSupplement', () => {
    it('should update a supplement by ID', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        name: 'Updated Supplement',
        description: 'Updated description'
      };
      const updatedSupplement = {
        _id: supplementId,
        ...updateData,
        userId: 'user-id-123'
      };

      mockSupplement.findOneAndUpdate.mockResolvedValue(updatedSupplement as any);

      const req = mockAuthRequest({
        params: { id: supplementId },
        body: updateData
      });
      const res = mockResponse();

      await supplementController.updateSupplement(req, res);

      expect(mockSupplement.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: supplementId, userId: 'user-id-123' },
        updateData,
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedSupplement);
    });

    it('should return 404 if supplement to update not found', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Supplement' };

      mockSupplement.findOneAndUpdate.mockResolvedValue(null);

      const req = mockAuthRequest({
        params: { id: supplementId },
        body: updateData
      });
      const res = mockResponse();

      await supplementController.updateSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should handle update errors', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();
      const updateData = { name: 'Updated Supplement' };

      mockSupplement.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      const req = mockAuthRequest({
        params: { id: supplementId },
        body: updateData
      });
      const res = mockResponse();

      await supplementController.updateSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('deleteSupplement', () => {
    it('should delete a supplement by ID', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();
      const supplement = {
        _id: supplementId,
        name: 'Test Supplement',
        userId: 'user-id-123'
      };

      mockSupplement.findOneAndDelete.mockResolvedValue(supplement as any);

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.deleteSupplement(req, res);

      expect(mockSupplement.findOneAndDelete).toHaveBeenCalledWith({ 
        _id: supplementId, 
        userId: 'user-id-123' 
      });
      expect(res.send).toHaveBeenCalledWith(supplement);
    });

    it('should return 404 if supplement to delete not found', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();

      mockSupplement.findOneAndDelete.mockResolvedValue(null);

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.deleteSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith();
    });

    it('should handle delete errors', async () => {
      const supplementId = new mongoose.Types.ObjectId().toString();

      mockSupplement.findOneAndDelete.mockRejectedValue(new Error('Database error'));

      const req = mockAuthRequest({ 
        params: { id: supplementId }
      });
      const res = mockResponse();

      await supplementController.deleteSupplement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllSupplements', () => {
    it('should return all supplements for a user', async () => {
      const supplements = [
        {
          _id: 'supplement1',
          name: 'Supplement 1',
          userId: 'user-id-123'
        },
        {
          _id: 'supplement2',
          name: 'Supplement 2',
          userId: 'user-id-123'
        }
      ];

      mockSupplement.find.mockResolvedValue(supplements as any);

      const req = mockAuthRequest();
      const res = mockResponse();

      await supplementController.getAllSupplements(req, res);

      expect(mockSupplement.find).toHaveBeenCalledWith({ userId: 'user-id-123' });
      expect(res.send).toHaveBeenCalledWith(supplements);
    });

    it('should handle errors when retrieving supplements', async () => {
      mockSupplement.find.mockRejectedValue(new Error('Database error'));

      const req = mockAuthRequest();
      const res = mockResponse();

      await supplementController.getAllSupplements(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(expect.any(Error));
    });
  });
}); 