import mongoose from 'mongoose';
import * as tagController from '../../src/controllers/tagController';
import { mockAuthRequest, mockResponse } from '../mocks/auth.mock';
import { createModelMock, setupModelMock } from '../mocks/mongoose.mock';

// Mock the Tag model
jest.mock('../../src/models/Tag');

// Import the mock after defining it
import Tag from '../../src/models/Tag';

// Create mock for Tag model
const tagMock = createModelMock('Tag');
const mockTagFunctions = tagMock.mockFunctions;

describe('Tag Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock for each test
    (Tag as jest.MockedFunction<any>).mockImplementation(tagMock.mockConstructor);
    Object.assign(Tag, mockTagFunctions);
  });

  describe('createTag', () => {
    it('should create a tag successfully', async () => {
      // Mock data
      const tagData = {
        name: 'Test Tag',
        color: '#FF5733'
      };
      
      const savedTag = {
        ...tagData,
        _id: new mongoose.Types.ObjectId()
      };

      // Mock request and response
      const req = mockAuthRequest({ body: tagData });
      const res = mockResponse();

      // Create a specific mock instance for this test
      const mockInstance = {
        ...tagData,
        save: jest.fn().mockResolvedValue(savedTag)
      };
      
      // Override the default mock implementation for this test
      (Tag as jest.MockedFunction<any>).mockReturnValueOnce(mockInstance);

      // Call controller method
      await tagController.createTag(req, res);

      // Assertions
      expect(Tag).toHaveBeenCalledWith(tagData);
      expect(mockInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(expect.objectContaining(tagData));
    });

    it('should handle errors during tag creation', async () => {
      // Mock data
      const tagData = { name: 'Invalid Tag' };

      // Mock request and response
      const req = mockAuthRequest({ body: tagData });
      const res = mockResponse();

      // Create a specific mock instance with an error
      const mockError = new Error('Validation error');
      const mockInstance = {
        ...tagData,
        save: jest.fn().mockRejectedValue(mockError)
      };
      
      // Override the default mock implementation for this test
      (Tag as jest.MockedFunction<any>).mockReturnValueOnce(mockInstance);

      // Call controller method
      await tagController.createTag(req, res);

      // Assertions
      expect(mockInstance.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getTag', () => {
    it('should get a tag by ID', async () => {
      // Mock data
      const tagId = new mongoose.Types.ObjectId().toString();
      const tag = {
        _id: tagId,
        name: 'Test Tag',
        color: '#FF5733'
      };

      // Mock findById
      mockTagFunctions.findById.mockResolvedValue(tag);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: tagId } });
      const res = mockResponse();

      // Call controller method
      await tagController.getTag(req, res);

      // Assertions
      expect(mockTagFunctions.findById).toHaveBeenCalledWith(tagId);
      expect(res.send).toHaveBeenCalledWith(tag);
    });

    it('should return 404 if tag not found', async () => {
      // Mock findById to return null
      mockTagFunctions.findById.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'non_existent_id' } });
      const res = mockResponse();

      // Call controller method
      await tagController.getTag(req, res);

      // Assertions
      expect(mockTagFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle database errors when getting tag', async () => {
      // Mock findById to throw an error
      mockTagFunctions.findById.mockRejectedValue(new Error('Database error'));

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'tag1' } });
      const res = mockResponse();

      // Call controller method
      await tagController.getTag(req, res);

      // Assertions
      expect(mockTagFunctions.findById).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('updateTag', () => {
    it('should update a tag by ID', async () => {
      // Mock data
      const tagId = new mongoose.Types.ObjectId().toString();
      const updatedTag = {
        _id: tagId,
        name: 'Updated Tag',
        color: '#00FF00'
      };

      // Mock findByIdAndUpdate
      mockTagFunctions.findByIdAndUpdate.mockResolvedValue(updatedTag);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: tagId },
        body: { name: 'Updated Tag', color: '#00FF00' }
      });
      const res = mockResponse();

      // Call controller method
      await tagController.updateTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndUpdate).toHaveBeenCalledWith(
        tagId,
        { name: 'Updated Tag', color: '#00FF00' },
        { new: true, runValidators: true }
      );
      expect(res.send).toHaveBeenCalledWith(updatedTag);
    });

    it('should return 404 if tag to update not found', async () => {
      // Mock findByIdAndUpdate to return null
      mockTagFunctions.findByIdAndUpdate.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'non_existent_id' },
        body: { name: 'Updated Tag' }
      });
      const res = mockResponse();

      // Call controller method
      await tagController.updateTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      // Mock findByIdAndUpdate to throw an error
      mockTagFunctions.findByIdAndUpdate.mockRejectedValue(new Error('Update error'));

      // Mock request and response
      const req = mockAuthRequest({
        params: { id: 'tag1' },
        body: { name: 'Updated Tag' }
      });
      const res = mockResponse();

      // Call controller method
      await tagController.updateTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag by ID', async () => {
      // Mock data
      const tagId = new mongoose.Types.ObjectId().toString();
      const deletedTag = {
        _id: tagId,
        name: 'Tag to Delete',
        color: '#FF0000'
      };

      // Mock findByIdAndDelete
      mockTagFunctions.findByIdAndDelete.mockResolvedValue(deletedTag);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: tagId } });
      const res = mockResponse();

      // Call controller method
      await tagController.deleteTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndDelete).toHaveBeenCalledWith(tagId);
      expect(res.send).toHaveBeenCalledWith(deletedTag);
    });

    it('should return 404 if tag to delete not found', async () => {
      // Mock findByIdAndDelete to return null
      mockTagFunctions.findByIdAndDelete.mockResolvedValue(null);

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'non_existent_id' } });
      const res = mockResponse();

      // Call controller method
      await tagController.deleteTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      // Mock findByIdAndDelete to throw an error
      mockTagFunctions.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));

      // Mock request and response
      const req = mockAuthRequest({ params: { id: 'tag1' } });
      const res = mockResponse();

      // Call controller method
      await tagController.deleteTag(req, res);

      // Assertions
      expect(mockTagFunctions.findByIdAndDelete).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAllTags', () => {
    it('should return all tags', async () => {
      // Mock data
      const tags = [
        { _id: '1', name: 'Tag 1', color: '#FF0000' },
        { _id: '2', name: 'Tag 2', color: '#00FF00' }
      ];

      // Mock find
      mockTagFunctions.find.mockResolvedValue(tags);

      // Mock request and response
      const req = mockAuthRequest();
      const res = mockResponse();

      // Call controller method
      await tagController.getAllTags(req, res);

      // Assertions
      expect(mockTagFunctions.find).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(tags);
    });

    it('should handle errors when retrieving tags', async () => {
      // Mock find to throw an error
      mockTagFunctions.find.mockRejectedValue(new Error('Database error'));

      // Mock request and response
      const req = mockAuthRequest();
      const res = mockResponse();

      // Call controller method
      await tagController.getAllTags(req, res);

      // Assertions
      expect(mockTagFunctions.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
    });
  });
}); 