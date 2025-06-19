import mongoose from 'mongoose';
import Session from '../../src/models/Session';

describe('Session Model', () => {
  it('should create a session with required fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    const programId = new mongoose.Types.ObjectId();
    
    const sessionData = {
      userId: userId,
      programId: programId,
      name: 'Chest Day',
      description: 'Chest workout session'
    };

    const session = new Session(sessionData);
    await session.save();

    const foundSession = await Session.findById(session._id);
    expect(foundSession).not.toBeNull();
    expect(foundSession?.name).toBe('Chest Day');
    expect(foundSession?.description).toBe('Chest workout session');
    expect(foundSession?.userId.toString()).toBe(userId.toString());
    expect(foundSession?.programId.toString()).toBe(programId.toString());
    expect(foundSession?.createdAt).toBeDefined();
    expect(foundSession?.updatedAt).toBeDefined();
    expect(foundSession?.exercises).toHaveLength(0);
  });

  it('should create a session with exercises', async () => {
    const userId = new mongoose.Types.ObjectId();
    const programId = new mongoose.Types.ObjectId();
    const exerciseId1 = new mongoose.Types.ObjectId();
    const exerciseId2 = new mongoose.Types.ObjectId();
    
    const sessionData = {
      userId: userId,
      programId: programId,
      name: 'Full Session',
      description: 'Complete workout session',
      exercises: [exerciseId1, exerciseId2]
    };

    const session = new Session(sessionData);
    await session.save();

    const foundSession = await Session.findById(session._id);
    expect(foundSession).not.toBeNull();
    expect(foundSession?.exercises).toHaveLength(2);
    expect(foundSession?.exercises[0].toString()).toBe(exerciseId1.toString());
    expect(foundSession?.exercises[1].toString()).toBe(exerciseId2.toString());
  });

  it('should not create a session without required fields', async () => {
    // Missing userId which is required
    const session1 = new Session({
      programId: new mongoose.Types.ObjectId(),
      name: 'Invalid Session',
      description: 'Missing userId'
    });
    
    await expect(session1.save()).rejects.toThrow();

    // Missing programId which is required
    const session2 = new Session({
      userId: new mongoose.Types.ObjectId(),
      name: 'Invalid Session',
      description: 'Missing programId'
    });
    
    await expect(session2.save()).rejects.toThrow();

    // Missing name which is required
    const session3 = new Session({
      userId: new mongoose.Types.ObjectId(),
      programId: new mongoose.Types.ObjectId(),
      description: 'Missing name'
    });
    
    await expect(session3.save()).rejects.toThrow();

    // Missing description which is required
    const session4 = new Session({
      userId: new mongoose.Types.ObjectId(),
      programId: new mongoose.Types.ObjectId(),
      name: 'Invalid Session'
    });
    
    await expect(session4.save()).rejects.toThrow();
  });

  it('should update a session', async () => {
    const userId = new mongoose.Types.ObjectId();
    const programId = new mongoose.Types.ObjectId();
    
    // Create a session
    const sessionData = {
      userId: userId,
      programId: programId,
      name: 'Original Session',
      description: 'Original description'
    };

    const session = new Session(sessionData);
    await session.save();

    // Update the session
    const updatedSession = await Session.findByIdAndUpdate(
      session._id,
      { 
        name: 'Updated Session',
        description: 'Updated description' 
      },
      { new: true }
    );

    expect(updatedSession).not.toBeNull();
    expect(updatedSession?.name).toBe('Updated Session');
    expect(updatedSession?.description).toBe('Updated description');
    // IDs should remain the same
    expect(updatedSession?.userId.toString()).toBe(userId.toString());
    expect(updatedSession?.programId.toString()).toBe(programId.toString());
  });

  it('should add exercises to a session', async () => {
    const userId = new mongoose.Types.ObjectId();
    const programId = new mongoose.Types.ObjectId();
    
    // Create a session
    const sessionData = {
      userId: userId,
      programId: programId,
      name: 'Workout Session',
      description: 'Session with exercises',
      exercises: []
    };

    const session = new Session(sessionData);
    await session.save();

    // Add an exercise
    const exerciseId = new mongoose.Types.ObjectId();
    await Session.findByIdAndUpdate(
      session._id,
      { $push: { exercises: exerciseId } },
      { new: true }
    );

    const updatedSession = await Session.findById(session._id);
    expect(updatedSession).not.toBeNull();
    expect(updatedSession?.exercises).toHaveLength(1);
    expect(updatedSession?.exercises[0].toString()).toBe(exerciseId.toString());
  });

  it('should delete a session', async () => {
    const userId = new mongoose.Types.ObjectId();
    const programId = new mongoose.Types.ObjectId();
    
    // Create a session
    const sessionData = {
      userId: userId,
      programId: programId,
      name: 'Session to Delete',
      description: 'Will be deleted'
    };

    const session = new Session(sessionData);
    await session.save();

    // Delete the session
    await Session.deleteOne({ _id: session._id });

    // Try to find the deleted session
    const deletedSession = await Session.findById(session._id);
    expect(deletedSession).toBeNull();
  });
}); 