import { Router } from 'express';
import { subscribe, unsubscribe } from '../controllers/pushController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/subscribe', auth, subscribe);
router.post('/unsubscribe', auth, unsubscribe);

export default router; 