import { Router } from 'express';
import { createMuscle, getMuscle, updateMuscle, deleteMuscle, getAllMuscles } from '../controllers/muscleController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createMuscle);
router.get('/:id', auth, getMuscle);
router.get('/', auth, getAllMuscles);
router.put('/:id', auth, updateMuscle);
router.delete('/:id', auth, deleteMuscle);

export default router;