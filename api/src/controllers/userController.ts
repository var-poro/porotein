import {Request, Response} from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
    userId?: string;
}

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).populate('activeProgram');
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.userId, updates, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Add a new weight entry
export const addWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }
        
        const weightEntry = {
            weight: req.body.weight,
            date: new Date(req.body.date || Date.now())
        };
        
        user.weightHistory.push(weightEntry);
        await user.save();
        
        res.status(201).send(weightEntry);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get weight history
export const getWeightHistory = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }
        
        res.send(user.weightHistory);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a weight entry
export const updateWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }

        const entryIndex = user.weightHistory.findIndex(
            entry => entry._id.toString() === req.params.entryId
        );

        if (entryIndex === -1) {
            return res.status(404).send();
        }

        user.weightHistory[entryIndex] = {
            ...user.weightHistory[entryIndex],
            weight: req.body.weight,
            date: new Date(req.body.date)
        };

        await user.save();
        res.send(user.weightHistory[entryIndex]);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a weight entry
export const deleteWeight = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).send();
        }

        user.weightHistory = user.weightHistory.filter(
            entry => entry._id.toString() !== req.params.entryId
        );

        await user.save();
        res.send({ message: 'Weight entry deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
};