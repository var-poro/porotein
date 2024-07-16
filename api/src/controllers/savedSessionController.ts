import {Request, Response} from 'express';
import SavedSession from '../models/SavedSession';

interface AuthRequest extends Request {
    userId?: string;
}

export const createSavedSession = async (req: AuthRequest, res: Response) => {
    try {
        const savedSession = new SavedSession({...req.body, userId: req.userId});
        await savedSession.save();
        res.status(201).send(savedSession);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getSavedSession = async (req: AuthRequest, res: Response) => {
    try {
        const savedSession = await SavedSession.findOne({_id: req.params.id, userId: req.userId}).populate('exercises');
        if (!savedSession) {
            return res.status(404).send();
        }
        res.send(savedSession);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateSavedSession = async (req: AuthRequest, res: Response) => {
    try {
        const savedSession = await SavedSession.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId},
            req.body,
            {new: true, runValidators: true},
        );

        if (!savedSession) {
            return res.status(404).send();
        }

        res.send(savedSession);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteSavedSession = async (req: AuthRequest, res: Response) => {
    try {
        const savedSession = await SavedSession.findOneAndDelete({_id: req.params.id, userId: req.userId});
        if (!savedSession) {
            return res.status(404).send();
        }
        res.send(savedSession);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllSavedSessions = async (req: AuthRequest, res: Response) => {
    try {
        const savedSessions = await SavedSession.find({userId: req.userId}).populate('exercises');
        res.send(savedSessions);
    } catch (error) {
        res.status(500).send(error);
    }
};
