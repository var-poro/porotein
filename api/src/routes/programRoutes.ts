import { Router } from 'express';
import {
  createProgram,
  deleteProgram,
  getAllPrograms,
  getProgram,
  getSessionsByProgramId,
  updateProgram,
} from '../controllers/programController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createProgram);
router.get('/:id', auth, getProgram);
router.get('/', auth, getAllPrograms);
router.put('/:id', auth, updateProgram);
router.delete('/:id', auth, deleteProgram);
router.get('/:programId/sessions', auth, getSessionsByProgramId);

export default router;