import {Router} from 'express';
import {
    createSavedExercise,
    createSavedRepSet,
    deleteSavedExercise,
    deleteSavedRepSet,
    getAllSavedExercises,
    getAllSavedRepSets,
    getSavedExercise,
    getSavedRepSet,
    updateSavedExercise,
    updateSavedRepSet
} from '../controllers/savedExerciseController';
import {auth} from '../middleware/auth';

const router = Router();

router.post('/:sessionId/exercises', auth, createSavedExercise);
router.put('/:sessionId/exercises/:exerciseId', auth, updateSavedExercise);
router.delete('/:sessionId/exercises/:exerciseId', auth, deleteSavedExercise);
router.get('/:sessionId/exercises/:exerciseId', auth, getSavedExercise);
router.get('/:sessionId/exercises', auth, getAllSavedExercises);

// Routes for SavedRepSets
router.post('/:sessionId/exercises/:exerciseId/reps', auth, createSavedRepSet);
router.get('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, getSavedRepSet);
router.put('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, updateSavedRepSet);
router.delete('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, deleteSavedRepSet);
router.get('/:sessionId/exercises/:exerciseId/reps', auth, getAllSavedRepSets);

export default router;
