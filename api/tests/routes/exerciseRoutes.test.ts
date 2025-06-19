import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import { auth } from '../../src/middleware/auth';
import exerciseRoutes from '../../src/routes/exerciseRoutes';
import Exercise from '../../src/models/Exercise';

jest.mock('../../src/middleware/auth');
jest.mock('../../src/models/Exercise');

describe('Exercise Routes', () => {
  let app: Express;
  
  beforeEach(() => {
    // Mock le middleware d'authentification
    (auth as jest.Mock).mockImplementation((req, res, next) => {
      req.userId = new mongoose.Types.ObjectId().toString();
      next();
    });

    // Configuration express pour les tests
    app = express();
    app.use(express.json());
    app.use('/api/exercises', exerciseRoutes);
  });

  describe('POST /exercises', () => {
    it('should create an exercise successfully', async () => {
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const exerciseData = {
        name: 'Test Exercise',
        description: 'Test description',
        type: 'strength',
        repSets: [{ repetitions: 10, weight: 50, restTime: 60 }]
      };

      // Mock pour le modèle Exercise
      const mockSave = jest.fn().mockResolvedValue({
        _id: exerciseId,
        ...exerciseData
      });
      
      (Exercise as jest.MockedClass<typeof Exercise>).prototype.save = mockSave;

      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData)
        .expect(201);

      // Verify the save method was called
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('GET /exercises/:id', () => {
    it('should retrieve an exercise by id', async () => {
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const exercise = {
        _id: exerciseId,
        name: 'Test Exercise',
        description: 'Test description',
        type: 'strength',
        repSets: [{ repetitions: 10, weight: 50, restTime: 60 }]
      };

      // Mock pour Exercise.findById
      (Exercise.findById as jest.Mock) = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockReturnValue(Promise.resolve(exercise))
      }));

      const response = await request(app)
        .get(`/api/exercises/${exerciseId}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', exerciseId);
      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
    });
  });

  describe('POST /exercises/:exerciseId/segments', () => {
    it('should add a cardio segment to an exercise', async () => {
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const segment = {
        name: 'Test Segment',
        distance: 1,
        distanceUnit: 'km',
        duration: 300,
        durationUnit: 'min'
      };

      const mockExercise = {
        _id: exerciseId,
        segments: [],
        save: jest.fn().mockResolvedValue({
          _id: exerciseId,
          segments: [segment]
        })
      };

      // Mock pour Exercise.findById
      (Exercise.findById as jest.Mock) = jest.fn().mockResolvedValue(mockExercise);

      const response = await request(app)
        .post(`/api/exercises/${exerciseId}/segments`)
        .send(segment)
        .expect(201);

      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
      expect(mockExercise.save).toHaveBeenCalled();
      expect(response.body).toHaveLength(1);
    });
  });

  describe('PUT /exercises/:exerciseId/segments/:segmentIndex', () => {
    it('should update a cardio segment', async () => {
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const segmentIndex = '0';
      const oldSegment = {
        name: 'Old Segment',
        distance: 0.5,
        distanceUnit: 'km'
      };
      const newSegment = {
        name: 'Updated Segment',
        distance: 1,
        distanceUnit: 'km'
      };

      const mockExercise = {
        _id: exerciseId,
        segments: [oldSegment],
        save: jest.fn().mockResolvedValue({
          _id: exerciseId,
          segments: [newSegment]
        })
      };

      // Mock pour Exercise.findById
      (Exercise.findById as jest.Mock) = jest.fn().mockResolvedValue(mockExercise);

      const response = await request(app)
        .put(`/api/exercises/${exerciseId}/segments/${segmentIndex}`)
        .send(newSegment)
        .expect(200);

      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
      expect(mockExercise.segments[0]).toEqual(newSegment);
      expect(mockExercise.save).toHaveBeenCalled();
    });
  });

  describe('DELETE /exercises/:exerciseId/segments/:segmentIndex', () => {
    it('should delete a cardio segment', async () => {
      const exerciseId = new mongoose.Types.ObjectId().toString();
      const segmentIndex = '0';
      const segments = [{ name: 'Segment to Delete' }];

      const mockExercise = {
        _id: exerciseId,
        segments,
        save: jest.fn().mockResolvedValue({
          _id: exerciseId,
          segments: []
        })
      };

      // Mock pour Exercise.findById
      (Exercise.findById as jest.Mock) = jest.fn().mockResolvedValue(mockExercise);

      // Mock pour la méthode splice
      segments.splice = jest.fn();

      const response = await request(app)
        .delete(`/api/exercises/${exerciseId}/segments/${segmentIndex}`)
        .expect(200);

      expect(Exercise.findById).toHaveBeenCalledWith(exerciseId);
      expect(segments.splice).toHaveBeenCalledWith(Number(segmentIndex), 1);
      expect(mockExercise.save).toHaveBeenCalled();
    });
  });
}); 