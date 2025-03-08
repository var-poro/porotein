import express from 'express';
import { addWeight, getWeightHistory, updateWeight, deleteWeight } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.use(auth);

router.post('/', addWeight);
router.get('/', getWeightHistory);
router.put('/:entryId', updateWeight);
router.delete('/:entryId', deleteWeight);

export default router;