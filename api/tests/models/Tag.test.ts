import mongoose from 'mongoose';
import Tag from '../../src/models/Tag';

describe('Tag Model', () => {
  it('should create a tag with required fields', async () => {
    const tagData = {
      name: 'Strength',
      description: 'Strength training exercises'
    };

    const tag = new Tag(tagData);
    await tag.save();

    const foundTag = await Tag.findById(tag._id);
    expect(foundTag).not.toBeNull();
    expect(foundTag?.name).toBe('Strength');
    expect(foundTag?.description).toBe('Strength training exercises');
  });

  it('should create a tag with only name', async () => {
    const tagData = {
      name: 'Cardio'
      // No description
    };

    const tag = new Tag(tagData);
    await tag.save();

    const foundTag = await Tag.findById(tag._id);
    expect(foundTag).not.toBeNull();
    expect(foundTag?.name).toBe('Cardio');
    expect(foundTag?.description).toBeUndefined();
  });

  it('should not create a tag without name', async () => {
    const tagData = {
      description: 'A tag without name'
      // Missing name which is required
    };

    const tag = new Tag(tagData);
    
    await expect(tag.save()).rejects.toThrow();
  });

  it('should update a tag', async () => {
    // Create a tag
    const tagData = {
      name: 'Flexibility',
      description: 'Original description'
    };

    const tag = new Tag(tagData);
    await tag.save();

    // Update the tag
    const updatedTag = await Tag.findByIdAndUpdate(
      tag._id,
      { description: 'Updated description' },
      { new: true }
    );

    expect(updatedTag).not.toBeNull();
    expect(updatedTag?.name).toBe('Flexibility');
    expect(updatedTag?.description).toBe('Updated description');
  });

  it('should delete a tag', async () => {
    // Create a tag
    const tagData = {
      name: 'Temporary',
      description: 'Will be deleted'
    };

    const tag = new Tag(tagData);
    await tag.save();

    // Delete the tag
    await Tag.deleteOne({ _id: tag._id });

    // Try to find the deleted tag
    const deletedTag = await Tag.findById(tag._id);
    expect(deletedTag).toBeNull();
  });
}); 