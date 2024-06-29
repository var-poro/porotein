import { Request, Response } from 'express';
import Supplement from '../models/Supplement';

interface AuthRequest extends Request {
    userId?: string;
}

export const createSupplement = async (req: AuthRequest, res: Response) => {
    try {
        const supplement = new Supplement({ ...req.body, userId: req.userId });
        await supplement.save();
        res.status(201).send(supplement);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getSupplement = async (req: AuthRequest, res: Response) => {
    try {
        const supplement = await Supplement.findOne({ _id: req.params.id, userId: req.userId });
        if (!supplement) {
            return res.status(404).send();
        }
        res.send(supplement);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateSupplement = async (req: AuthRequest, res: Response) => {
    try {
        const supplement = await Supplement.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true });
        if (!supplement) {
            return res.status(404).send();
        }
        res.send(supplement);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteSupplement = async (req: AuthRequest, res: Response) => {
    try {
        const supplement = await Supplement.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!supplement) {
            return res.status(404).send();
        }
        res.send(supplement);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllSupplements = async (req: AuthRequest, res: Response) => {
    try {
        const supplements = await Supplement.find({ userId: req.userId });
        res.send(supplements);
    } catch (error) {
        res.status(500).send(error);
    }
};