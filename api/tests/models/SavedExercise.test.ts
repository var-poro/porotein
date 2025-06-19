import mongoose from 'mongoose';
import SavedExercise from '../../src/models/SavedExercise';

describe('SavedExercise Model', () => {
  it('should create a saved exercise with repSets correctly', async () => {
    const savedExerciseData = {
      exerciseId: new mongoose.Types.ObjectId(),
      name: 'Saved Squat',
      duration: 300,
      repSets: [
        {
          repSetId: new mongoose.Types.ObjectId(),
          repetitions: 12,
          weight: 60,
          restTime: 60,
          duration: 30
        }
      ]
    };

    const savedExercise = new SavedExercise(savedExerciseData);
    await savedExercise.save();

    const foundSavedExercise = await SavedExercise.findById(savedExercise._id);
    expect(foundSavedExercise).not.toBeNull();
    expect(foundSavedExercise?.name).toBe('Saved Squat');
    expect(foundSavedExercise?.repSets).toHaveLength(1);
    expect(foundSavedExercise?.repSets?.[0].repetitions).toBe(12);
    expect(foundSavedExercise?.repSets?.[0].duration).toBe(30);
  });

  it('should create a saved exercise with savedSegments correctly', async () => {
    const savedExerciseData = {
      exerciseId: new mongoose.Types.ObjectId(),
      name: 'Saved Running',
      duration: 600,
      savedSegments: [
        {
          segmentId: new mongoose.Types.ObjectId(),
          name: 'Sprint',
          distance: 0.5,
          distanceUnit: 'km',
          duration: 120,
          durationUnit: 'min',
          pace: 4,
          paceUnit: 'min/km',
          intensity: 5,
          order: 1
        }
      ]
    };

    const savedExercise = new SavedExercise(savedExerciseData);
    await savedExercise.save();

    const foundSavedExercise = await SavedExercise.findById(savedExercise._id);
    expect(foundSavedExercise).not.toBeNull();
    expect(foundSavedExercise?.name).toBe('Saved Running');
    expect(foundSavedExercise?.savedSegments).toHaveLength(1);
    expect(foundSavedExercise?.savedSegments?.[0].name).toBe('Sprint');
    expect(foundSavedExercise?.savedSegments?.[0].distance).toBe(0.5);
    expect(foundSavedExercise?.savedSegments?.[0].distanceUnit).toBe('km');
  });

  it('should not create a saved exercise without required fields', async () => {
    const savedExerciseData = {
      name: 'Invalid Saved Exercise',
      // Manque exerciseId et duration qui sont requis
    };

    const savedExercise = new SavedExercise(savedExerciseData);
    
    await expect(savedExercise.save()).rejects.toThrow();
  });
}); 