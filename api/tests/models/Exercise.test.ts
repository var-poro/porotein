import mongoose from 'mongoose';
import Exercise from '../../src/models/Exercise';

describe('Exercise Model', () => {
  it('should create an exercise with strength type correctly', async () => {
    const exerciseData = {
      name: 'Squat',
      description: 'Squat exercise for legs',
      tags: [new mongoose.Types.ObjectId()],
      targetMuscles: [new mongoose.Types.ObjectId()],
      difficulty: 'medium',
      type: 'strength',
      repSets: [
        {
          repetitions: 10,
          weight: 50,
          restTime: 60
        }
      ]
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    const foundExercise = await Exercise.findById(exercise._id);
    expect(foundExercise).not.toBeNull();
    expect(foundExercise?.name).toBe('Squat');
    expect(foundExercise?.type).toBe('strength');
    expect(foundExercise?.repSets).toBeDefined();
    expect(foundExercise?.repSets?.length).toBe(1);
    expect(foundExercise?.repSets?.[0]?.repetitions).toBe(10);
  });

  it('should create an exercise with cardio type correctly', async () => {
    const exerciseData = {
      name: 'Running',
      description: 'Outdoor running',
      tags: [new mongoose.Types.ObjectId()],
      targetMuscles: [new mongoose.Types.ObjectId()],
      difficulty: 'medium',
      type: 'cardio',
      segments: [
        {
          name: 'Warm-up',
          distance: 1,
          distanceUnit: 'km',
          duration: 5,
          durationUnit: 'min',
          pace: 5,
          paceUnit: 'min/km',
          intensity: 2,
          order: 1
        }
      ]
    };

    const exercise = new Exercise(exerciseData);
    await exercise.save();

    const foundExercise = await Exercise.findById(exercise._id);
    expect(foundExercise).not.toBeNull();
    expect(foundExercise?.name).toBe('Running');
    expect(foundExercise?.type).toBe('cardio');
    expect(foundExercise?.segments).toBeDefined();
    expect(foundExercise?.segments?.length).toBe(1);
    expect(foundExercise?.segments?.[0]?.name).toBe('Warm-up');
    expect(foundExercise?.segments?.[0]?.distance).toBe(1);
  });

  it('should not create an exercise without a required field', async () => {
    const exerciseData = {
      name: 'Invalid Exercise',
      // Manque la description et le type qui sont requis
    };

    const exercise = new Exercise(exerciseData);
    
    await expect(exercise.save()).rejects.toThrow();
  });

  it('should validate exercise type field correctly', async () => {
    const exerciseData = {
      name: 'Invalid Type Exercise',
      description: 'Exercise with invalid type',
      type: 'invalid' // Type non valide
    };

    const exercise = new Exercise(exerciseData);
    
    await expect(exercise.save()).rejects.toThrow();
  });
}); 