import { Router } from 'express';
import { createNotification, getNotification, updateNotification, deleteNotification, getAllNotifications } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createNotification);
router.get('/:id', auth, getNotification);
router.get('/', auth, getAllNotifications);
router.put('/:id', auth, updateNotification);
router.delete('/:id', auth, deleteNotification);

export default router;