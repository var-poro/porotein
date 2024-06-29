import { Request, Response } from 'express';
import Session from '../models/Session';
import Exercise from '../models/Exercise';

interface AuthRequest extends Request {
  userId?: string;
}

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = new Session({ ...req.body, userId: req.userId });
    await session.save();
    res.status(201).send(session);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, userId: req.userId }).populate('exercises');
    if (!session) {
      return res.status(404).send();
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true },
    );

    if (!session) {
      return res.status(404).send();
    }

    res.send(session);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!session) {
      return res.status(404).send();
    }
    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({ userId: req.userId }).populate('exercises');
    res.send(sessions);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const createExerciseInSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id: sessionId } = req.params;
    const exercise = new Exercise(req.body);
    await exercise.save();

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { $push: { exercises: exercise._id } },
      { new: true, runValidators: true },
    );

    if (!session) {
      return res.status(404).send('Session not found');
    }

    res.status(201).send(exercise);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateExerciseInSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id: sessionId, exerciseId } = req.params;

    const exercise = await Exercise.findByIdAndUpdate(exerciseId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }

    res.send(exercise);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteExerciseFromSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id: sessionId, exerciseId } = req.params;

    const session = await Session.findByIdAndUpdate(
      sessionId,
      { $pull: { exercises: exerciseId } },
      { new: true, runValidators: true },
    );

    if (!session) {
      return res.status(404).send('Session not found');
    }

    await Exercise.findByIdAndDelete(exerciseId);

    res.send(session);
  } catch (error) {
    res.status(500).send(error);
  }
};