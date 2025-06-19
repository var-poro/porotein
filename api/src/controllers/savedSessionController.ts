import { Request, Response } from 'express';
import SavedSession from '../models/SavedSession';
import User from '../models/User';
import Session from '../models/Session';
import { Types } from 'mongoose';
import { ISavedExercise } from '../models/SavedExercise';

interface AuthRequest extends Request {
  userId?: string;
  sessionId?: string;
}

export const createSavedSession = async (req: AuthRequest, res: Response) => {
  try {
    const { exercises, duration, programId, sessionId } = req.body;

    // Create the saved session first
    const savedSession = new SavedSession({
      userId: req.userId,
      sessionId: sessionId,
      programId,
      duration,
      savedExercises: exercises.map((exercise: ISavedExercise) => ({
        exerciseId: exercise.exerciseId || exercise._id,
        name: exercise.name,
        duration: exercise.duration,
        repSets: exercise.repSets?.map((repSet) => ({
          repSetId: new Types.ObjectId(),
          repetitions: repSet.repetitions,
          weight: repSet.weight,
          restTime: repSet.restTime,
          duration: repSet.duration
        })) || []
      }))
    });

    // Save the session
    await savedSession.save();

    // Populate the saved exercises
    const populatedSession = await SavedSession.findById(savedSession._id)
      .populate('savedExercises')
      .populate('sessionId');

    res.status(201).send(populatedSession);
  } catch (error: any) {
    console.error('Error creating saved session:', error);
    res.status(400).send({ error: error.message });
  }
};

export const getSavedSession = async (req: AuthRequest, res: Response) => {
  try {
    const savedSession = await SavedSession.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).populate('savedExercises').populate('session');
    if (!savedSession) {
      return res.status(404).send({ error: 'Session not found' });
    }
    res.send(savedSession);
  } catch (error: any) {
    res.status(500).send({ error: error.message || 'An error occurred while fetching the session' });
  }
};

export const updateSavedSession = async (req: AuthRequest, res: Response) => {
  try {
    const { exercises, duration } = req.body;

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0 || !duration) {
      return res.status(400).send({ error: 'Missing or invalid required fields: exercises or duration' });
    }

    const savedSession = await SavedSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!savedSession) {
      return res.status(404).send({ error: 'Session not found' });
    }

    res.send(savedSession);
  } catch (error: any) {
    res.status(400).send({ error: error.message || 'An error occurred while updating the session' });
  }
};

export const deleteSavedSession = async (req: AuthRequest, res: Response) => {
  try {
    const savedSession = await SavedSession.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!savedSession) {
      return res.status(404).send({ error: 'Session not found' });
    }
    res.send(savedSession);
  } catch (error: any) {
    res.status(500).send({ error: error.message || 'An error occurred while deleting the session' });
  }
};

export const getAllSavedSessions = async (req: AuthRequest, res: Response) => {
  try {
    const { filter } = req.query;
    const userId = req.userId;
    let query: any = { userId };

    if (filter) {
      const now = new Date();
      
      if (filter === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        query.performedAt = { $gte: oneWeekAgo };
      }
      
      if (filter === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        query.performedAt = { $gte: oneMonthAgo };
      }
    }

    const sessions = await SavedSession.find(query)
      .sort({ performedAt: -1 })
      .populate('session');

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved sessions', error });
  }
};

export const getSavedSessionsBySessionId = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    console.log('Fetching sessions for:', { sessionId, userId });

    const savedSessions = await SavedSession.find({ 
      userId: userId, 
      sessionId: sessionId 
    })
    .sort({ performedAt: -1 })
    .populate('session')
    .populate('savedExercises.exerciseId');

    console.log('Found sessions:', savedSessions.length);
    res.json(savedSessions);
  } catch (error) {
    console.error('Error fetching saved sessions by session ID:', error);
    res.status(500).json({ 
      message: 'Error fetching saved sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getLatestSavedSessionPerType = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.activeProgram) {
      return res.status(400).send({ error: 'User or active program not found' });
    }

    console.log('userId:', req.userId);
    console.log('activeProgram:', user.activeProgram);

    const savedSessions = await SavedSession.aggregate([
      {
        $match: {
          userId: req.userId,
          programId: user.activeProgram,
        },
      },
      {
        $sort: { performedAt: -1 }, // Tri par la date performedAt (du plus récent au plus ancien)
      },
      {
        $group: {
          _id: '$sessionId', // Grouper par sessionId ou type de session
          latestSavedSession: { $first: '$$ROOT' }, // Prendre la première session après tri (la plus récente)
        },
      },
    ]);

    if (!savedSessions.length) {
      console.log('No saved sessions found');
    }

    res.send(savedSessions.map((group) => group.latestSavedSession));
  } catch (error: any) {
    res.status(500).send({ error: error.message || 'An error occurred while fetching the sessions' });
  }
};

export const getRecommendedSessions = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.activeProgram) {
      return res.status(400).send({ error: 'User or active program not found' });
    }

    // Get all sessions from active program
    const programSessions = await Session.find({ 
      programId: user.activeProgram
    }).lean();
    
    if (!programSessions.length) {
      return res.json({
        recommended: null,
        otherSessions: [],
        lastPerformed: {}
      });
    }

    // Get latest saved sessions for each session type
    const savedSessions = await SavedSession.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(req.userId),
          programId: user.activeProgram
        }
      },
      {
        $sort: { performedAt: -1 }
      },
      {
        $group: {
          _id: '$sessionId',
          lastPerformed: { $first: '$performedAt' }
        }
      }
    ]);

    // Create a map for quick lookup with safe type checking
    const lastPerformedMap = savedSessions.reduce((acc, curr) => {
      if (curr && curr._id) {
        acc[curr._id.toString()] = curr.lastPerformed;
      }
      return acc;
    }, {} as { [key: string]: Date });

    // Sort sessions with null safety
    const sortedSessions = programSessions.sort((a, b) => {
      const aId = a._id ? a._id.toString() : '';
      const bId = b._id ? b._id.toString() : '';
      const aLastPerformed = lastPerformedMap[aId];
      const bLastPerformed = lastPerformedMap[bId];

      if (!aLastPerformed && bLastPerformed) return -1;
      if (aLastPerformed && !bLastPerformed) return 1;
      if (!aLastPerformed && !bLastPerformed) return 0;

      return new Date(aLastPerformed).getTime() - new Date(bLastPerformed).getTime();
    });

    res.json({
      recommended: sortedSessions[0] || null,
      otherSessions: sortedSessions.slice(1),
      lastPerformed: lastPerformedMap
    });

  } catch (error: any) {
    console.error('Error in getRecommendedSessions:', error);
    res.status(500).send({ error: error.message || 'An error occurred while fetching recommended sessions' });
  }
};