import { Request, Response } from 'express';
import Exercise from '../models/Exercise';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  userId?: string;
}

export const createExercise = async (req: AuthRequest, res: Response) => {
  try {
    const exercise = new Exercise(req.body);
    await exercise.save();
    res.status(201).send(exercise);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getExercise = async (req: AuthRequest, res: Response) => {
  const { fullTagDetails } = req.query;
  try {
    let exercise;
    if (fullTagDetails) {
      exercise = await Exercise.findById(req.params.id).populate('tags').populate('targetMuscles');
    } else {
      exercise = await Exercise.findById(req.params.id).select('name description videoUrl difficulty repSets segments type tags targetMuscles createdAt updatedAt');
    }

    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }
    res.send(exercise);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateExercise = async (req: AuthRequest, res: Response) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }
    res.send(exercise);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteExercise = async (req: AuthRequest, res: Response) => {
  try {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);
    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }
    res.send(exercise);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllExercises = async (req: AuthRequest, res: Response) => {
  try {
    const exercises = await Exercise.find();
    res.send(exercises);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Controllers for RepSets

export const createRepSet = async (req: AuthRequest, res: Response) => {
  const { exerciseId } = req.params;
  const { repetitions, weight, restTime } = req.body;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }

    const newRepSet = {
      _id: new mongoose.Types.ObjectId(),
      repetitions,
      weight,
      restTime,
    };

    if (!exercise.repSets) {
      exercise.set('repSets', []);
    }
    
    exercise.repSets!.push(newRepSet);
    await exercise.save();

    res.status(201).send(newRepSet);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getRepSet = async (req: AuthRequest, res: Response) => {
  const { exerciseId, repSetId } = req.params;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise || !exercise.repSets) {
      return res.status(404).send('Exercise or repSets not found');
    }

    const repSet = exercise.repSets.id(repSetId);
    if (!repSet) {
      return res.status(404).send('RepSet not found');
    }

    res.send(repSet);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateRepSet = async (req: AuthRequest, res: Response) => {
  const { exerciseId, repSetId } = req.params;
  const { repetitions, weight, restTime } = req.body;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise || !exercise.repSets) {
      return res.status(404).send('Exercise or repSets not found');
    }

    const repSet = exercise.repSets.id(repSetId);
    if (!repSet) {
      return res.status(404).send('RepSet not found');
    }

    repSet.repetitions = repetitions;
    repSet.weight = weight;
    repSet.restTime = restTime;

    await exercise.save();

    res.send(repSet);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteRepSet = async (req: AuthRequest, res: Response) => {
  const { exerciseId, repSetId } = req.params;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise || !exercise.repSets) {
      return res.status(404).send('Exercise or repSets not found');
    }

    const repSet = exercise.repSets.id(repSetId);
    if (!repSet) {
      return res.status(404).send('RepSet not found');
    }

    repSet.deleteOne();

    await exercise.save();

    res.send(repSet);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllRepSets = async (req: AuthRequest, res: Response) => {
  const { exerciseId } = req.params;

  try {
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise || !exercise.repSets) {
      return res.status(404).send('Exercise or repSets not found');
    }

    res.send(exercise.repSets);
  } catch (error) {
    res.status(500).send(error);
  }
};

// CRUD pour les segments cardio
export const addCardioSegment = async (req: AuthRequest, res: Response) => {
  const { exerciseId } = req.params;
  const segment = req.body;
  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }
    exercise.segments = exercise.segments || [];
    exercise.segments.push(segment);
    await exercise.save();
    res.status(201).send(exercise.segments);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateCardioSegment = async (req: AuthRequest, res: Response) => {
  const { exerciseId, segmentIndex } = req.params;
  const segment = req.body;
  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || !exercise.segments) {
      return res.status(404).send('Exercise or segments not found');
    }
    if (Number(segmentIndex) < 0 || Number(segmentIndex) >= exercise.segments.length) {
      return res.status(404).send('Segment not found');
    }
    exercise.segments[Number(segmentIndex)] = segment;
    await exercise.save();
    res.send(exercise.segments);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteCardioSegment = async (req: AuthRequest, res: Response) => {
  const { exerciseId, segmentIndex } = req.params;
  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || !exercise.segments) {
      return res.status(404).send('Exercise or segments not found');
    }
    if (Number(segmentIndex) < 0 || Number(segmentIndex) >= exercise.segments.length) {
      return res.status(404).send('Segment not found');
    }
    exercise.segments.splice(Number(segmentIndex), 1);
    await exercise.save();
    res.send(exercise.segments);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllCardioSegments = async (req: AuthRequest, res: Response) => {
  const { exerciseId } = req.params;
  try {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      return res.status(404).send('Exercise not found');
    }
    res.send(exercise.segments || []);
  } catch (error) {
    res.status(500).send(error);
  }
};