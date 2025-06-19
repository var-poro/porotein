import {Router} from 'express';
import {
    createSavedExercise,
    createSavedRepSet,
    deleteSavedExercise,
    deleteSavedRepSet,
    getAllSavedExercises,
    getAllSavedRepSets,
    getSavedExercise,
    getSavedRepSet,
    updateSavedExercise,
    updateSavedRepSet,
    addSavedCardioSegment,
    updateSavedCardioSegment,
    deleteSavedCardioSegment,
    getAllSavedCardioSegments,
} from '../controllers/savedExerciseController';
import {auth} from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SavedExercises
 *   description: Gestion des exercices sauvegardés dans les sessions
 */

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises:
 *   post:
 *     summary: Créer un nouvel exercice sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 description: ID de l'exercice
 *               order:
 *                 type: number
 *                 description: Ordre de l'exercice dans la session
 *               notes:
 *                 type: string
 *                 description: Notes sur l'exercice
 *     responses:
 *       201:
 *         description: Exercice sauvegardé créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/:sessionId/exercises', auth, createSavedExercise);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}:
 *   put:
 *     summary: Mettre à jour un exercice sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order:
 *                 type: number
 *                 description: Ordre de l'exercice dans la session
 *               notes:
 *                 type: string
 *                 description: Notes sur l'exercice
 *     responses:
 *       200:
 *         description: Exercice sauvegardé mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice sauvegardé non trouvé
 */
router.put('/:sessionId/exercises/:exerciseId', auth, updateSavedExercise);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}:
 *   delete:
 *     summary: Supprimer un exercice sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     responses:
 *       200:
 *         description: Exercice sauvegardé supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice sauvegardé non trouvé
 */
router.delete('/:sessionId/exercises/:exerciseId', auth, deleteSavedExercise);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}:
 *   get:
 *     summary: Obtenir un exercice sauvegardé par son ID
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     responses:
 *       200:
 *         description: Exercice sauvegardé récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice sauvegardé non trouvé
 */
router.get('/:sessionId/exercises/:exerciseId', auth, getSavedExercise);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises:
 *   get:
 *     summary: Obtenir tous les exercices sauvegardés d'une session
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *     responses:
 *       200:
 *         description: Liste des exercices sauvegardés récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/:sessionId/exercises', auth, getAllSavedExercises);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/reps:
 *   post:
 *     summary: Créer un nouveau set de répétitions sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sets
 *               - reps
 *             properties:
 *               sets:
 *                 type: number
 *                 description: Nombre de séries
 *               reps:
 *                 type: number
 *                 description: Nombre de répétitions
 *               weight:
 *                 type: number
 *                 description: Poids utilisé
 *               order:
 *                 type: number
 *                 description: Ordre du set dans l'exercice
 *     responses:
 *       201:
 *         description: Set de répétitions sauvegardé créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/:sessionId/exercises/:exerciseId/reps', auth, createSavedRepSet);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/reps/{repSetId}:
 *   get:
 *     summary: Obtenir un set de répétitions sauvegardé par son ID
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du set de répétitions
 *     responses:
 *       200:
 *         description: Set de répétitions sauvegardé récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Set de répétitions sauvegardé non trouvé
 */
router.get('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, getSavedRepSet);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/reps/{repSetId}:
 *   put:
 *     summary: Mettre à jour un set de répétitions sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du set de répétitions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sets:
 *                 type: number
 *                 description: Nombre de séries
 *               reps:
 *                 type: number
 *                 description: Nombre de répétitions
 *               weight:
 *                 type: number
 *                 description: Poids utilisé
 *               order:
 *                 type: number
 *                 description: Ordre du set dans l'exercice
 *     responses:
 *       200:
 *         description: Set de répétitions sauvegardé mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Set de répétitions sauvegardé non trouvé
 */
router.put('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, updateSavedRepSet);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/reps/{repSetId}:
 *   delete:
 *     summary: Supprimer un set de répétitions sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du set de répétitions
 *     responses:
 *       200:
 *         description: Set de répétitions sauvegardé supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Set de répétitions sauvegardé non trouvé
 */
router.delete('/:sessionId/exercises/:exerciseId/reps/:repSetId', auth, deleteSavedRepSet);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/reps:
 *   get:
 *     summary: Obtenir tous les sets de répétitions d'un exercice sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     responses:
 *       200:
 *         description: Liste des sets de répétitions récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/:sessionId/exercises/:exerciseId/reps', auth, getAllSavedRepSets);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/segments:
 *   post:
 *     summary: Ajouter un nouveau segment cardio sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - segment
 *             properties:
 *               segment:
 *                 type: object
 *                 description: Le segment cardio sauvegardé
 *     responses:
 *       201:
 *         description: Segment cardio sauvegardé créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/:sessionId/exercises/:exerciseId/segments', auth, addSavedCardioSegment);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/segments/{segmentIndex}:
 *   put:
 *     summary: Mettre à jour un segment cardio sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *       - in: path
 *         name: segmentIndex
 *         schema:
 *           type: string
 *         required: true
 *         description: Index du segment cardio sauvegardé
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - segment
 *             properties:
 *               segment:
 *                 type: object
 *                 description: Le segment cardio sauvegardé
 *     responses:
 *       200:
 *         description: Segment cardio sauvegardé mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Segment cardio sauvegardé non trouvé
 */
router.put('/:sessionId/exercises/:exerciseId/segments/:segmentIndex', auth, updateSavedCardioSegment);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/segments/{segmentIndex}:
 *   delete:
 *     summary: Supprimer un segment cardio sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *       - in: path
 *         name: segmentIndex
 *         schema:
 *           type: string
 *         required: true
 *         description: Index du segment cardio sauvegardé
 *     responses:
 *       200:
 *         description: Segment cardio sauvegardé supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Segment cardio sauvegardé non trouvé
 */
router.delete('/:sessionId/exercises/:exerciseId/segments/:segmentIndex', auth, deleteSavedCardioSegment);

/**
 * @swagger
 * /saved-sessions/{sessionId}/exercises/{exerciseId}/segments:
 *   get:
 *     summary: Obtenir tous les segments cardio sauvegardés d'un exercice sauvegardé
 *     tags: [SavedExercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session sauvegardée
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice sauvegardé
 *     responses:
 *       200:
 *         description: Liste des segments cardio sauvegardés récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/:sessionId/exercises/:exerciseId/segments', auth, getAllSavedCardioSegments);

export default router;
