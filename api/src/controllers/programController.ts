import { Request, Response } from 'express';
import Program from '../models/Program';
import Session from '../models/Session';

interface AuthRequest extends Request {
  userId?: string;
}

export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const program = new Program({ ...req.body, userId: req.userId });
    await program.save();
    res.status(201).send(program);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getProgram = async (req: AuthRequest, res: Response) => {
  try {
    const program = await Program.findOne({ _id: req.params.id, userId: req.userId });
    if (!program) {
      return res.status(404).send();
    }
    res.send(program);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateProgram = async (req: AuthRequest, res: Response) => {
  try {
    const program = await Program.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!program) {
      return res.status(404).send();
    }
    res.send(program);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteProgram = async (req: AuthRequest, res: Response) => {
  try {
    const program = await Program.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!program) {
      return res.status(404).send();
    }
    res.send(program);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAllPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const programs = await Program.find({ userId: req.userId });
    res.send(programs);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getSessionsByProgramId = async (req: AuthRequest, res: Response) => {
  try {
    const programId = req.params.programId;
    const sessions = await Session.find({ programId }).populate('exercises');
    if (!sessions) {
      return res.status(404).json({ message: 'No sessions found for this program' });
    }
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};