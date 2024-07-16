import {Request, Response} from 'express';
import SavedExercise from '../models/SavedExercise';
import SavedSession from '../models/SavedSession';

interface AuthRequest extends Request {
    userId?: string;
}

export const createSavedExercise = async (req: AuthRequest, res: Response) => {
    try {
        const {sessionId} = req.params;
        const savedExercise = new SavedExercise(req.body);
        await savedExercise.save();

        const session = await SavedSession.findByIdAndUpdate(
            sessionId,
            {$push: {exercises: savedExercise._id}},
            {new: true, runValidators: true},
        );

        if (!session) {
            return res.status(404).send('Session not found');
        }

        res.status(201).send(savedExercise);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const updateSavedExercise = async (req: AuthRequest, res: Response) => {
    try {
        const {exerciseId} = req.params;

        const savedExercise = await SavedExercise.findByIdAndUpdate(exerciseId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        res.send(savedExercise);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteSavedExercise = async (req: AuthRequest, res: Response) => {
    try {
        const {sessionId, exerciseId} = req.params;

        const session = await SavedSession.findByIdAndUpdate(
            sessionId,
            {$pull: {exercises: exerciseId}},
            {new: true, runValidators: true},
        );

        if (!session) {
            return res.status(404).send('Session not found');
        }

        await SavedExercise.findByIdAndDelete(exerciseId);

        res.send(session);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getSavedExercise = async (req: AuthRequest, res: Response) => {
    try {
        const {exerciseId} = req.params;
        const savedExercise = await SavedExercise.findById(exerciseId);
        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }
        res.send(savedExercise);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getAllSavedExercises = async (req: AuthRequest, res: Response) => {
    try {
        const {sessionId} = req.params;
        const savedExercises = await SavedExercise.find({sessionId});
        res.send(savedExercises);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Functions for SavedRepSets

export const createSavedRepSet = async (req: AuthRequest, res: Response) => {
    const {exerciseId} = req.params;
    const {repSetId, repetitions, weight, restTime, duration} = req.body;

    try {
        const savedExercise = await SavedExercise.findById(exerciseId);

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        const newRepSet = {
            repSetId,
            repetitions,
            weight,
            restTime,
            duration,
        };

        savedExercise.repSets.push(newRepSet);
        await savedExercise.save();

        res.status(201).send(newRepSet);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getSavedRepSet = async (req: AuthRequest, res: Response) => {
    const {exerciseId, repSetId} = req.params;

    try {
        const savedExercise = await SavedExercise.findById(exerciseId);

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        const savedRepSet = savedExercise.repSets.id(repSetId);
        if (!savedRepSet) {
            return res.status(404).send('RepSet not found');
        }

        res.send(savedRepSet);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateSavedRepSet = async (req: AuthRequest, res: Response) => {
    const {exerciseId, repSetId} = req.params;
    const {repetitions, weight, restTime, duration} = req.body;

    try {
        const savedExercise = await SavedExercise.findById(exerciseId);

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        const savedRepSet = savedExercise.repSets.id(repSetId);
        if (!savedRepSet) {
            return res.status(404).send('RepSet not found');
        }

        savedRepSet.repetitions = repetitions;
        savedRepSet.weight = weight;
        savedRepSet.restTime = restTime;
        savedRepSet.duration = duration;

        await savedExercise.save();

        res.send(savedRepSet);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteSavedRepSet = async (req: AuthRequest, res: Response) => {
    const {exerciseId, repSetId} = req.params;

    try {
        const savedExercise = await SavedExercise.findById(exerciseId);

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        const savedRepSet = savedExercise.repSets.id(repSetId);
        if (!savedRepSet) {
            return res.status(404).send('RepSet not found');
        }

        savedRepSet.deleteOne();

        await savedExercise.save();

        res.send(savedRepSet);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getAllSavedRepSets = async (req: AuthRequest, res: Response) => {
    const {exerciseId} = req.params;

    try {
        const savedExercise = await SavedExercise.findById(exerciseId);

        if (!savedExercise) {
            return res.status(404).send('Exercise not found');
        }

        res.send(savedExercise.repSets);
    } catch (error) {
        res.status(500).send(error);
    }
};
