import mongoose from 'mongoose';

/**
 * Helper function to create a mock for mongoose models
 * @param modelName Name of the model being mocked
 * @returns Mock functions for the model
 */
export function createModelMock(modelName: string) {
  // Standard mock functions for mongoose methods
  const mockFunctions = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
    deleteOne: jest.fn(),
    updateMany: jest.fn(),
    updateOne: jest.fn(),
    save: jest.fn(),
    populate: jest.fn()
  };

  // Setup chained methods
  mockFunctions.find.mockReturnValue({ 
    populate: mockFunctions.populate,
    exec: jest.fn().mockResolvedValue([])
  });
  
  mockFunctions.findById.mockReturnValue({ 
    populate: mockFunctions.populate,
    exec: jest.fn().mockResolvedValue({})
  });
  
  mockFunctions.findOne.mockReturnValue({ 
    populate: mockFunctions.populate,
    exec: jest.fn().mockResolvedValue({})
  });

  // Mock constructor function
  const mockConstructor = jest.fn().mockImplementation((data: any) => ({
    ...data,
    _id: data._id || new mongoose.Types.ObjectId(),
    save: mockFunctions.save.mockResolvedValue(data)
  }));

  // Return all mock functions
  return {
    modelName,
    mockFunctions,
    mockConstructor
  };
}

/**
 * Helper function to setup a mock for a mongoose model
 * @param mockModel The mock model object from createModelMock
 */
export function setupModelMock(mockModel: ReturnType<typeof createModelMock>) {
  // Assign all mock functions to the constructor
  Object.assign(mockModel.mockConstructor, mockModel.mockFunctions);
  
  return mockModel.mockConstructor;
}

/**
 * Reset all mock functions for a model
 * @param mockModel The mock model object from createModelMock
 */
export function resetModelMock(mockModel: ReturnType<typeof createModelMock>) {
  jest.clearAllMocks();
  
  // Reset chained methods
  mockModel.mockFunctions.find.mockReturnValue({ 
    populate: mockModel.mockFunctions.populate,
    exec: jest.fn().mockResolvedValue([])
  });
  
  mockModel.mockFunctions.findById.mockReturnValue({ 
    populate: mockModel.mockFunctions.populate,
    exec: jest.fn().mockResolvedValue({})
  });
  
  mockModel.mockFunctions.findOne.mockReturnValue({ 
    populate: mockModel.mockFunctions.populate,
    exec: jest.fn().mockResolvedValue({})
  });
} 