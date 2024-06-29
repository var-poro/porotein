import { Router } from 'express';
import { createTag, getTag, updateTag, deleteTag, getAllTags } from '../controllers/tagController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createTag);
router.get('/:id', auth, getTag);
router.get('/', auth, getAllTags);
router.put('/:id', auth, updateTag);
router.delete('/:id', auth, deleteTag);

export default router;