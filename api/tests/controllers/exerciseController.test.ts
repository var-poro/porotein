const mongoose = require('mongoose');

// Mock d'abord le modèle Exercise
jest.mock('../../src/models/Exercise', () => {
  const mockExercise = {
    save: jest.fn(),
    segments: [],
    repSets: {
      push: jest.fn(),
      id: jest.fn()
    }
  };
  
  return {
    __esModule: true,
    default: {
      findById: jest.fn(),
      find: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    }
  };
});

const exerciseController = require('../../src/controllers/exerciseController');
const Exercise = require('../../src/models/Exercise').default;

// Helper functions
const mockAuthRequest = (overrides = {}) => ({
  userId: '507f1f77bcf86cd799439011',
  params: {},
  body: {},
  ...overrides
});

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Exercise Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllExercises', () => {
    it('should return all exercises', async () => {
      const exercises = [{ name: 'Exercise 1' }, { name: 'Exercise 2' }];
      Exercise.find.mockResolvedValue(exercises);

      const req = mockAuthRequest();
      const res = mockResponse();

      await exerciseController.getAllExercises(req, res);

      expect(Exercise.find).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(exercises);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      Exercise.find.mockRejectedValue(error);

      const req = mockAuthRequest();
      const res = mockResponse();

      await exerciseController.getAllExercises(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(error);
    });
  });

  describe('RepSets CRUD', () => {
    describe('createRepSet', () => {
      it('should create a new repSet successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSetData = { repetitions: 10, weight: 50, restTime: 60 };
        
        const mockExercise = {
          repSets: [],
          set: jest.fn(),
          save: jest.fn()
        };
        mockExercise.repSets.push = jest.fn();
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId },
          body: repSetData
        });
        const res = mockResponse();

        await exerciseController.createRepSet(req, res);

        expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent' },
          body: { repetitions: 10, weight: 50, restTime: 60 }
        });
        const res = mockResponse();

        await exerciseController.createRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise not found');
      });

      it('should create repSets array if it does not exist', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSetData = { repetitions: 10, weight: 50, restTime: 60 };
        
        const mockExercise = {
          repSets: null, // No repSets initially
          set: jest.fn(),
          save: jest.fn()
        };
        // Mock push method will be added after set() is called
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId },
          body: repSetData
        });
        const res = mockResponse();

        await exerciseController.createRepSet(req, res);

        expect(mockExercise.set).toHaveBeenCalledWith('repSets', []);
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it('should handle errors during creation', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' },
          body: { repetitions: 10, weight: 50, restTime: 60 }
        });
        const res = mockResponse();

        await exerciseController.createRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('getRepSet', () => {
      it('should get a repSet by ID', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSetId = '507f1f77bcf86cd799439012';
        const mockRepSet = { repetitions: 10, weight: 50 };
        
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(mockRepSet)
          }
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId, repSetId }
        });
        const res = mockResponse();

        await exerciseController.getRepSet(req, res);

        expect(res.send).toHaveBeenCalledWith(mockRepSet);
      });

      it('should return 404 if repSet not found', async () => {
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(null)
          }
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', repSetId: 'nonexistent' }
        });
        const res = mockResponse();

        await exerciseController.getRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('RepSet not found');
      });
    });

    describe('updateRepSet', () => {
      it('should update a repSet successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSetId = '507f1f77bcf86cd799439012';
        const repSetData = { repetitions: 12, weight: 60, restTime: 90 };
        
        const mockRepSet = {
          repetitions: 10,
          weight: 50,
          restTime: 60
        };
        
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(mockRepSet)
          },
          save: jest.fn()
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId, repSetId },
          body: repSetData
        });
        const res = mockResponse();

        await exerciseController.updateRepSet(req, res);

        expect(mockRepSet.repetitions).toBe(repSetData.repetitions);
        expect(mockRepSet.weight).toBe(repSetData.weight);
        expect(mockRepSet.restTime).toBe(repSetData.restTime);
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockRepSet);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent', repSetId: 'repsetid' },
          body: { repetitions: 12, weight: 60, restTime: 90 }
        });
        const res = mockResponse();

        await exerciseController.updateRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or repSets not found');
      });

      it('should return 404 if repSet not found', async () => {
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(null)
          }
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', repSetId: 'nonexistent' },
          body: { repetitions: 12, weight: 60, restTime: 90 }
        });
        const res = mockResponse();

        await exerciseController.updateRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('RepSet not found');
      });

      it('should handle update errors', async () => {
        const mockRepSet = { repetitions: 10, weight: 50, restTime: 60 };
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(mockRepSet)
          },
          save: jest.fn().mockRejectedValue(new Error('Database error'))
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', repSetId: '507f1f77bcf86cd799439012' },
          body: { repetitions: 12, weight: 60, restTime: 90 }
        });
        const res = mockResponse();

        await exerciseController.updateRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('deleteRepSet', () => {
      it('should delete a repSet successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSetId = '507f1f77bcf86cd799439012';
        
        const mockRepSet = {
          repetitions: 10,
          weight: 50,
          restTime: 60,
          deleteOne: jest.fn()
        };
        
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(mockRepSet)
          },
          save: jest.fn()
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId, repSetId }
        });
        const res = mockResponse();

        await exerciseController.deleteRepSet(req, res);

        expect(mockRepSet.deleteOne).toHaveBeenCalled();
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockRepSet);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent', repSetId: 'repsetid' }
        });
        const res = mockResponse();

        await exerciseController.deleteRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or repSets not found');
      });

      it('should return 404 if repSet not found', async () => {
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(null)
          }
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', repSetId: 'nonexistent' }
        });
        const res = mockResponse();

        await exerciseController.deleteRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('RepSet not found');
      });

      it('should handle delete errors', async () => {
        const mockRepSet = { deleteOne: jest.fn() };
        const mockExercise = {
          repSets: {
            id: jest.fn().mockReturnValue(mockRepSet)
          },
          save: jest.fn().mockRejectedValue(new Error('Database error'))
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', repSetId: '507f1f77bcf86cd799439012' }
        });
        const res = mockResponse();

        await exerciseController.deleteRepSet(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('getAllRepSets', () => {
      it('should get all repSets for an exercise', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const repSets = [
          { repetitions: 10, weight: 50, restTime: 60 },
          { repetitions: 12, weight: 55, restTime: 90 }
        ];
        
        const mockExercise = { repSets };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId }
        });
        const res = mockResponse();

        await exerciseController.getAllRepSets(req, res);

        expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
        expect(res.send).toHaveBeenCalledWith(repSets);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent' }
        });
        const res = mockResponse();

        await exerciseController.getAllRepSets(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or repSets not found');
      });

      it('should return 404 if exercise has no repSets', async () => {
        const mockExercise = { repSets: null };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' }
        });
        const res = mockResponse();

        await exerciseController.getAllRepSets(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or repSets not found');
      });

      it('should handle errors', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' }
        });
        const res = mockResponse();

        await exerciseController.getAllRepSets(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe('Cardio Segments CRUD', () => {
    describe('addCardioSegment', () => {
      it('should add a cardio segment successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const segment = { type: 'run', duration: 300, intensity: 'medium' };
        
        const mockExercise = {
          segments: [],
          save: jest.fn()
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId },
          body: segment
        });
        const res = mockResponse();

        await exerciseController.addCardioSegment(req, res);

        expect(mockExercise.segments).toContain(segment);
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent' },
          body: { type: 'run', duration: 300 }
        });
        const res = mockResponse();

        await exerciseController.addCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise not found');
      });

      it('should handle errors during segment addition', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' },
          body: { type: 'run', duration: 300 }
        });
        const res = mockResponse();

        await exerciseController.addCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('updateCardioSegment', () => {
      it('should update a cardio segment successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const segmentIndex = '0';
        const updatedSegment = { type: 'bike', duration: 600, intensity: 'high' };
        
        const mockExercise = {
          segments: [{ type: 'run', duration: 300 }],
          save: jest.fn()
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId, segmentIndex },
          body: updatedSegment
        });
        const res = mockResponse();

        await exerciseController.updateCardioSegment(req, res);

        expect(mockExercise.segments[0]).toBe(updatedSegment);
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockExercise.segments);
      });

      it('should return 404 if segment index is out of bounds', async () => {
        const mockExercise = {
          segments: [{ type: 'run', duration: 300 }]
        };
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '5' },
          body: { type: 'bike', duration: 600 }
        });
        const res = mockResponse();

        await exerciseController.updateCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Segment not found');
      });

      it('should return 404 if exercise or segments not found', async () => {
        const mockExercise = { segments: null };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '0' },
          body: { type: 'bike', duration: 600 }
        });
        const res = mockResponse();

        await exerciseController.updateCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or segments not found');
      });

      it('should handle errors during segment update', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '0' },
          body: { type: 'bike', duration: 600 }
        });
        const res = mockResponse();

        await exerciseController.updateCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('deleteCardioSegment', () => {
      it('should delete a cardio segment successfully', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const segmentIndex = '0';
        
        const mockExercise = {
          segments: [{ type: 'run', duration: 300 }, { type: 'bike', duration: 600 }],
          save: jest.fn()
        };
        mockExercise.segments.splice = jest.fn();
        
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId, segmentIndex }
        });
        const res = mockResponse();

        await exerciseController.deleteCardioSegment(req, res);

        expect(mockExercise.segments.splice).toHaveBeenCalledWith(0, 1);
        expect(mockExercise.save).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(mockExercise.segments);
      });

      it('should return 404 if exercise or segments not found', async () => {
        const mockExercise = { segments: null };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '0' }
        });
        const res = mockResponse();

        await exerciseController.deleteCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise or segments not found');
      });

      it('should return 404 if segment index is out of bounds', async () => {
        const mockExercise = {
          segments: [{ type: 'run', duration: 300 }]
        };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '5' }
        });
        const res = mockResponse();

        await exerciseController.deleteCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Segment not found');
      });

      it('should handle errors during segment deletion', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011', segmentIndex: '0' }
        });
        const res = mockResponse();

        await exerciseController.deleteCardioSegment(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe('getAllCardioSegments', () => {
      it('should get all cardio segments', async () => {
        const exerciseId = '507f1f77bcf86cd799439011';
        const segments = [{ type: 'run', duration: 300 }];
        
        const mockExercise = { segments };
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId }
        });
        const res = mockResponse();

        await exerciseController.getAllCardioSegments(req, res);

        expect(res.send).toHaveBeenCalledWith(segments);
      });

      it('should return empty array if no segments', async () => {
        const mockExercise = {};
        Exercise.findById.mockResolvedValue(mockExercise);

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' }
        });
        const res = mockResponse();

        await exerciseController.getAllCardioSegments(req, res);

        expect(res.send).toHaveBeenCalledWith([]);
      });

      it('should return 404 if exercise not found', async () => {
        Exercise.findById.mockResolvedValue(null);

        const req = mockAuthRequest({
          params: { exerciseId: 'nonexistent' }
        });
        const res = mockResponse();

        await exerciseController.getAllCardioSegments(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith('Exercise not found');
      });

      it('should handle errors during segments retrieval', async () => {
        Exercise.findById.mockRejectedValue(new Error('Database error'));

        const req = mockAuthRequest({
          params: { exerciseId: '507f1f77bcf86cd799439011' }
        });
        const res = mockResponse();

        await exerciseController.getAllCardioSegments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
      });
    });
  });
}); 