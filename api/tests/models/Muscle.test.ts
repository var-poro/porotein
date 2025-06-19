import mongoose from 'mongoose';
import Muscle from '../../src/models/Muscle';

describe('Muscle Model', () => {
  it('should create a muscle with required fields', async () => {
    const muscleData = {
      name: 'Biceps',
      description: 'Front of the upper arm'
    };

    const muscle = new Muscle(muscleData);
    await muscle.save();

    const foundMuscle = await Muscle.findById(muscle._id);
    expect(foundMuscle).not.toBeNull();
    expect(foundMuscle?.name).toBe('Biceps');
    expect(foundMuscle?.description).toBe('Front of the upper arm');
  });

  it('should create a muscle with only name', async () => {
    const muscleData = {
      name: 'Quadriceps'
      // No description
    };

    const muscle = new Muscle(muscleData);
    await muscle.save();

    const foundMuscle = await Muscle.findById(muscle._id);
    expect(foundMuscle).not.toBeNull();
    expect(foundMuscle?.name).toBe('Quadriceps');
    expect(foundMuscle?.description).toBeUndefined();
  });

  it('should not create a muscle without name', async () => {
    const muscleData = {
      description: 'A muscle without name'
      // Missing name which is required
    };

    const muscle = new Muscle(muscleData);
    
    await expect(muscle.save()).rejects.toThrow();
  });

  it('should update a muscle', async () => {
    // Create a muscle
    const muscleData = {
      name: 'Triceps',
      description: 'Original description'
    };

    const muscle = new Muscle(muscleData);
    await muscle.save();

    // Update the muscle
    const updatedMuscle = await Muscle.findByIdAndUpdate(
      muscle._id,
      { description: 'Back of the upper arm' },
      { new: true }
    );

    expect(updatedMuscle).not.toBeNull();
    expect(updatedMuscle?.name).toBe('Triceps');
    expect(updatedMuscle?.description).toBe('Back of the upper arm');
  });

  it('should delete a muscle', async () => {
    // Create a muscle
    const muscleData = {
      name: 'Temporary',
      description: 'Will be deleted'
    };

    const muscle = new Muscle(muscleData);
    await muscle.save();

    // Delete the muscle
    await Muscle.deleteOne({ _id: muscle._id });

    // Try to find the deleted muscle
    const deletedMuscle = await Muscle.findById(muscle._id);
    expect(deletedMuscle).toBeNull();
  });
}); 