import { Router } from 'express';
import {
  createExercise,
  createRepSet,
  deleteExercise,
  deleteRepSet,
  getAllExercises,
  getAllRepSets,
  getExercise,
  getRepSet,
  updateExercise,
  updateRepSet,
} from '../controllers/exerciseController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createExercise);
router.get('/:id', auth, getExercise);
router.get('/', auth, getAllExercises);
router.put('/:id', auth, updateExercise);
router.delete('/:id', auth, deleteExercise);

// Routes for RepSets
router.post('/:exerciseId/reps', auth, createRepSet);
router.get('/:exerciseId/reps/:repSetId', auth, getRepSet);
router.put('/:exerciseId/reps/:repSetId', auth, updateRepSet);
router.delete('/:exerciseId/reps/:repSetId', auth, deleteRepSet);
router.get('/:exerciseId/reps', auth, getAllRepSets);

export default router;