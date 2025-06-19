import mongoose from 'mongoose';
import Supplement from '../../src/models/Supplement';

describe('Supplement Model', () => {
  it('should create a supplement with required fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    const supplementData = {
      userId: userId,
      name: 'Protein Powder',
      description: 'Whey protein supplement',
      type: 'Protein'
    };

    const supplement = new Supplement(supplementData);
    await supplement.save();

    const foundSupplement = await Supplement.findById(supplement._id);
    expect(foundSupplement).not.toBeNull();
    expect(foundSupplement?.name).toBe('Protein Powder');
    expect(foundSupplement?.description).toBe('Whey protein supplement');
    expect(foundSupplement?.type).toBe('Protein');
    expect(foundSupplement?.userId.toString()).toBe(userId.toString());
    expect(foundSupplement?.createdAt).toBeDefined();
  });

  it('should create a supplement without description', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    const supplementData = {
      userId: userId,
      name: 'Creatine',
      type: 'Performance'
      // No description
    };

    const supplement = new Supplement(supplementData);
    await supplement.save();

    const foundSupplement = await Supplement.findById(supplement._id);
    expect(foundSupplement).not.toBeNull();
    expect(foundSupplement?.name).toBe('Creatine');
    expect(foundSupplement?.type).toBe('Performance');
    expect(foundSupplement?.description).toBeUndefined();
  });

  it('should not create a supplement without required fields', async () => {
    // Missing userId which is required
    const supplement1 = new Supplement({
      name: 'Invalid Supplement',
      type: 'Protein'
    });
    
    await expect(supplement1.save()).rejects.toThrow();

    // Missing name which is required
    const supplement2 = new Supplement({
      userId: new mongoose.Types.ObjectId(),
      type: 'Protein'
    });
    
    await expect(supplement2.save()).rejects.toThrow();

    // Missing type which is required
    const supplement3 = new Supplement({
      userId: new mongoose.Types.ObjectId(),
      name: 'Invalid Supplement'
    });
    
    await expect(supplement3.save()).rejects.toThrow();
  });

  it('should update a supplement', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Create a supplement
    const supplementData = {
      userId: userId,
      name: 'Original Supplement',
      description: 'Original description',
      type: 'Original type'
    };

    const supplement = new Supplement(supplementData);
    await supplement.save();

    // Update the supplement
    const updatedSupplement = await Supplement.findByIdAndUpdate(
      supplement._id,
      { 
        name: 'Updated Supplement',
        description: 'Updated description',
        type: 'Updated type'
      },
      { new: true }
    );

    expect(updatedSupplement).not.toBeNull();
    expect(updatedSupplement?.name).toBe('Updated Supplement');
    expect(updatedSupplement?.description).toBe('Updated description');
    expect(updatedSupplement?.type).toBe('Updated type');
    expect(updatedSupplement?.userId.toString()).toBe(userId.toString()); // UserId should remain the same
  });

  it('should delete a supplement', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Create a supplement
    const supplementData = {
      userId: userId,
      name: 'Supplement to Delete',
      type: 'Will be deleted'
    };

    const supplement = new Supplement(supplementData);
    await supplement.save();

    // Delete the supplement
    await Supplement.deleteOne({ _id: supplement._id });

    // Try to find the deleted supplement
    const deletedSupplement = await Supplement.findById(supplement._id);
    expect(deletedSupplement).toBeNull();
  });
}); 