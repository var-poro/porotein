import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUser,
  updateCurrentUser,
  updateUser,
} from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', createUser);
router.get('/current', auth, getCurrentUser);
router.put('/current', auth, updateCurrentUser);
router.get('/:id', auth, getUser);
router.get('/', auth, getAllUsers);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

export default router;