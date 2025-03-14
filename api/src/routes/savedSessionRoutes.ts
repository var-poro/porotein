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

/**
 * @swagger
 * tags:
 *   name: Sessions Enregistrées
 *   description: Gestion des sessions d'entraînement enregistrées
 */

/**
 * @swagger
 * /saved-sessions:
 *   post:
 *     summary: Créer une nouvelle session enregistrée
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - date
 *             properties:
 *               session:
 *                 type: string
 *                 description: ID de la session de référence
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de la session
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       description: ID de l'exercice
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           reps:
 *                             type: number
 *                             description: Nombre de répétitions
 *                           weight:
 *                             type: number
 *                             description: Poids utilisé en kg
 *                           completed:
 *                             type: boolean
 *                             description: Si la série a été complétée
 *               duration:
 *                 type: number
 *                 description: Durée de la session en minutes
 *               notes:
 *                 type: string
 *                 description: Notes sur la session
 *     responses:
 *       201:
 *         description: Session enregistrée créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedSession'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createSavedSession);

/**
 * @swagger
 * /saved-sessions/latest:
 *   get:
 *     summary: Obtenir les dernières sessions enregistrées par type
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dernières sessions récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedSession'
 *       401:
 *         description: Non authentifié
 */
router.get('/latest', auth, getLatestSavedSessionPerType);

/**
 * @swagger
 * /saved-sessions/recommended:
 *   get:
 *     summary: Obtenir des sessions recommandées
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions recommandées récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Non authentifié
 */
router.get('/recommended', auth, getRecommendedSessions);

/**
 * @swagger
 * /saved-sessions/by-session/{sessionId}:
 *   get:
 *     summary: Obtenir les sessions enregistrées par ID de session
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session de référence
 *     responses:
 *       200:
 *         description: Sessions enregistrées récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedSession'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session non trouvée
 */
router.get('/by-session/:sessionId', auth, getSavedSessionsBySessionId);

/**
 * @swagger
 * /saved-sessions/{id}:
 *   get:
 *     summary: Obtenir une session enregistrée par son ID
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session enregistrée
 *     responses:
 *       200:
 *         description: Session enregistrée récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedSession'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session enregistrée non trouvée
 */
router.get('/:id', auth, getSavedSession);

/**
 * @swagger
 * /saved-sessions:
 *   get:
 *     summary: Obtenir toutes les sessions enregistrées
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des sessions enregistrées récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedSession'
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllSavedSessions);

/**
 * @swagger
 * /saved-sessions/{id}:
 *   put:
 *     summary: Mettre à jour une session enregistrée
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session enregistrée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de la session
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       description: ID de l'exercice
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           reps:
 *                             type: number
 *                             description: Nombre de répétitions
 *                           weight:
 *                             type: number
 *                             description: Poids utilisé en kg
 *                           completed:
 *                             type: boolean
 *                             description: Si la série a été complétée
 *               duration:
 *                 type: number
 *                 description: Durée de la session en minutes
 *               notes:
 *                 type: string
 *                 description: Notes sur la session
 *     responses:
 *       200:
 *         description: Session enregistrée mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedSession'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session enregistrée non trouvée
 */
router.put('/:id', auth, updateSavedSession);

/**
 * @swagger
 * /saved-sessions/{id}:
 *   delete:
 *     summary: Supprimer une session enregistrée
 *     tags: [Sessions Enregistrées]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session enregistrée
 *     responses:
 *       200:
 *         description: Session enregistrée supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session enregistrée non trouvée
 */
router.delete('/:id', auth, deleteSavedSession);

export default router;
