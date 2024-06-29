import { Request, Response } from 'express';
import Muscle from '../models/Muscle';

interface AuthRequest extends Request {
    userId?: string;
}

export const createMuscle = async (req: AuthRequest, res: Response) => {
    try {
        const muscle = new Muscle(req.body);
        await muscle.save();
        res.status(201).send(muscle);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getMuscle = async (req: AuthRequest, res: Response) => {
    try {
        const muscle = await Muscle.findById(req.params.id);
        if (!muscle) {
            return res.status(404).send();
        }
        res.send(muscle);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateMuscle = async (req: AuthRequest, res: Response) => {
    try {
        const muscle = await Muscle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!muscle) {
            return res.status(404).send();
        }
        res.send(muscle);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteMuscle = async (req: AuthRequest, res: Response) => {
    try {
        const muscle = await Muscle.findByIdAndDelete(req.params.id);
        if (!muscle) {
            return res.status(404).send();
        }
        res.send(muscle);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllMuscles = async (req: AuthRequest, res: Response) => {
    try {
        const muscles = await Muscle.find();
        res.send(muscles);
    } catch (error) {
        res.status(500).send(error);
    }
};
