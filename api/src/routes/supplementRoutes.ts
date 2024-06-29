import { Router } from 'express';
import { createSupplement, getSupplement, updateSupplement, deleteSupplement, getAllSupplements } from '../controllers/supplementController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createSupplement);
router.get('/:id', auth, getSupplement);
router.get('/', auth, getAllSupplements);
router.put('/:id', auth, updateSupplement);
router.delete('/:id', auth, deleteSupplement);

export default router;