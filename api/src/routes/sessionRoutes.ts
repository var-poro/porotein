import { Router } from 'express';
import {
  createExerciseInSession,
  createSession,
  deleteExerciseFromSession,
  deleteSession,
  getAllSessions,
  getSession,
  updateExerciseInSession,
  updateSession,
} from '../controllers/sessionController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createSession);
router.get('/:id', auth, getSession);
router.get('/', auth, getAllSessions);
router.put('/:id', auth, updateSession);
router.delete('/:id', auth, deleteSession);
router.post('/:id/exercises', auth, createExerciseInSession);
router.put('/:id/exercises/:exerciseId', auth, updateExerciseInSession);
router.delete('/:id/exercises/:exerciseId', auth, deleteExerciseFromSession);

export default router;