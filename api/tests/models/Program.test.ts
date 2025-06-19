import mongoose from 'mongoose';
import Program from '../../src/models/Program';

describe('Program Model', () => {
  it('should create a program with required fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    const programData = {
      userId: userId,
      name: 'Strength Program',
      description: 'A program for strength training'
    };

    const program = new Program(programData);
    await program.save();

    const foundProgram = await Program.findById(program._id);
    expect(foundProgram).not.toBeNull();
    expect(foundProgram?.name).toBe('Strength Program');
    expect(foundProgram?.description).toBe('A program for strength training');
    expect(foundProgram?.userId.toString()).toBe(userId.toString());
    expect(foundProgram?.createdAt).toBeDefined();
    expect(foundProgram?.sessions).toHaveLength(0);
  });

  it('should create a program with sessions', async () => {
    const userId = new mongoose.Types.ObjectId();
    const sessionId1 = new mongoose.Types.ObjectId();
    const sessionId2 = new mongoose.Types.ObjectId();
    
    const programData = {
      userId: userId,
      name: 'Full Program',
      description: 'A complete workout program',
      sessions: [sessionId1, sessionId2]
    };

    const program = new Program(programData);
    await program.save();

    const foundProgram = await Program.findById(program._id);
    expect(foundProgram).not.toBeNull();
    expect(foundProgram?.sessions).toHaveLength(2);
    expect(foundProgram?.sessions[0].toString()).toBe(sessionId1.toString());
    expect(foundProgram?.sessions[1].toString()).toBe(sessionId2.toString());
  });

  it('should not create a program without required fields', async () => {
    // Missing userId which is required
    const program1 = new Program({
      name: 'Invalid Program',
      description: 'Missing userId'
    });
    
    await expect(program1.save()).rejects.toThrow();

    // Missing name which is required
    const program2 = new Program({
      userId: new mongoose.Types.ObjectId(),
      description: 'Missing name'
    });
    
    await expect(program2.save()).rejects.toThrow();

    // Missing description which is required
    const program3 = new Program({
      userId: new mongoose.Types.ObjectId(),
      name: 'Invalid Program'
    });
    
    await expect(program3.save()).rejects.toThrow();
  });

  it('should update a program', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Create a program
    const programData = {
      userId: userId,
      name: 'Original Program',
      description: 'Original description'
    };

    const program = new Program(programData);
    await program.save();

    // Update the program
    const updatedProgram = await Program.findByIdAndUpdate(
      program._id,
      { 
        name: 'Updated Program',
        description: 'Updated description' 
      },
      { new: true }
    );

    expect(updatedProgram).not.toBeNull();
    expect(updatedProgram?.name).toBe('Updated Program');
    expect(updatedProgram?.description).toBe('Updated description');
    expect(updatedProgram?.userId.toString()).toBe(userId.toString()); // UserId should remain the same
  });

  it('should add a session to a program', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Create a program
    const programData = {
      userId: userId,
      name: 'Workout Program',
      description: 'Program with sessions',
      sessions: []
    };

    const program = new Program(programData);
    await program.save();

    // Add a session
    const sessionId = new mongoose.Types.ObjectId();
    await Program.findByIdAndUpdate(
      program._id,
      { $push: { sessions: sessionId } },
      { new: true }
    );

    const updatedProgram = await Program.findById(program._id);
    expect(updatedProgram).not.toBeNull();
    expect(updatedProgram?.sessions).toHaveLength(1);
    expect(updatedProgram?.sessions[0].toString()).toBe(sessionId.toString());
  });

  it('should delete a program', async () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Create a program
    const programData = {
      userId: userId,
      name: 'Program to Delete',
      description: 'Will be deleted'
    };

    const program = new Program(programData);
    await program.save();

    // Delete the program
    await Program.deleteOne({ _id: program._id });

    // Try to find the deleted program
    const deletedProgram = await Program.findById(program._id);
    expect(deletedProgram).toBeNull();
  });
}); 