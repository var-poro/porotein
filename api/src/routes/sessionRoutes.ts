import { Router } from 'express';
import {
  createExerciseInSession,
  createSession,
  deleteExerciseFromSession,
  deleteSession,
  getAllSessions,
  getSession,
  updateExerciseInSession,
  updateSession,
} from '../controllers/sessionController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Gestion des sessions d'entraînement
 */

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Créer une nouvelle session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la session
 *               description:
 *                 type: string
 *                 description: Description de la session
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       description: ID de l'exercice
 *                     sets:
 *                       type: number
 *                       description: Nombre de séries
 *                     reps:
 *                       type: number
 *                       description: Nombre de répétitions
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createSession);

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Obtenir une session par son ID
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *     responses:
 *       200:
 *         description: Session récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session non trouvée
 */
router.get('/:id', auth, getSession);

/**
 * @swagger
 * /sessions:
 *   get:
 *     summary: Obtenir toutes les sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des sessions récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllSessions);

/**
 * @swagger
 * /sessions/{id}:
 *   put:
 *     summary: Mettre à jour une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de la session
 *               description:
 *                 type: string
 *                 description: Description de la session
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       description: ID de l'exercice
 *                     sets:
 *                       type: number
 *                       description: Nombre de séries
 *                     reps:
 *                       type: number
 *                       description: Nombre de répétitions
 *     responses:
 *       200:
 *         description: Session mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session non trouvée
 */
router.put('/:id', auth, updateSession);

/**
 * @swagger
 * /sessions/{id}:
 *   delete:
 *     summary: Supprimer une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *     responses:
 *       200:
 *         description: Session supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session non trouvée
 */
router.delete('/:id', auth, deleteSession);

/**
 * @swagger
 * /sessions/{id}/exercises:
 *   post:
 *     summary: Ajouter un exercice à une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercise
 *               - sets
 *               - reps
 *             properties:
 *               exercise:
 *                 type: string
 *                 description: ID de l'exercice
 *               sets:
 *                 type: number
 *                 description: Nombre de séries
 *               reps:
 *                 type: number
 *                 description: Nombre de répétitions
 *     responses:
 *       201:
 *         description: Exercice ajouté à la session avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session non trouvée
 */
router.post('/:id/exercises', auth, createExerciseInSession);

/**
 * @swagger
 * /sessions/{id}/exercises/{exerciseId}:
 *   put:
 *     summary: Mettre à jour un exercice dans une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice dans la session
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
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Session'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session ou exercice non trouvé
 */
router.put('/:id/exercises/:exerciseId', auth, updateExerciseInSession);

/**
 * @swagger
 * /sessions/{id}/exercises/{exerciseId}:
 *   delete:
 *     summary: Supprimer un exercice d'une session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la session
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice dans la session
 *     responses:
 *       200:
 *         description: Exercice supprimé de la session avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Session ou exercice non trouvé
 */
router.delete('/:id/exercises/:exerciseId', auth, deleteExerciseFromSession);

export default router;