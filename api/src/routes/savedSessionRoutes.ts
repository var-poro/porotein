import { Router } from 'express';
import {
    createSavedSession,
    deleteSavedSession,
    getAllSavedSessions,
    getLatestSavedSessionPerType,
    getRecommendedSessions,
    getSavedSession,
    getSavedSessionsBySessionId,
    updateSavedSession,
} from '../controllers/savedSessionController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, createSavedSession);
router.get('/latest', auth, getLatestSavedSessionPerType);
router.get('/recommended', auth, getRecommendedSessions);
router.get('/by-session/:sessionId', auth, getSavedSessionsBySessionId);
router.get('/:id', auth, getSavedSession);
router.get('/', auth, getAllSavedSessions);
router.put('/:id', auth, updateSavedSession);
router.delete('/:id', auth, deleteSavedSession);

export default router;
