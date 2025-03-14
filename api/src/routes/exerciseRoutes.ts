import { Router } from 'express';
import {
  createExercise,
  createRepSet,
  deleteExercise,
  deleteRepSet,
  getAllExercises,
  getAllRepSets,
  getExercise,
  getRepSet,
  updateExercise,
  updateRepSet,
} from '../controllers/exerciseController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Exercices
 *   description: Gestion des exercices
 */

/**
 * @swagger
 * /exercises:
 *   post:
 *     summary: Créer un nouvel exercice
 *     tags: [Exercices]
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
 *                 description: Nom de l'exercice
 *               description:
 *                 type: string
 *                 description: Description de l'exercice
 *               muscles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des muscles ciblés
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des tags associés
 *     responses:
 *       201:
 *         description: Exercice créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Obtenir un exercice par son ID
 *     tags: [Exercices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     responses:
 *       200:
 *         description: Exercice récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé
 */
router.get('/:id', auth, getExercise);

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Obtenir tous les exercices
 *     tags: [Exercices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des exercices récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Exercise'
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllExercises);

/**
 * @swagger
 * /exercises/{id}:
 *   put:
 *     summary: Mettre à jour un exercice
 *     tags: [Exercices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom de l'exercice
 *               description:
 *                 type: string
 *                 description: Description de l'exercice
 *               muscles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des muscles ciblés
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs des tags associés
 *     responses:
 *       200:
 *         description: Exercice mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé
 */
router.put('/:id', auth, updateExercise);

/**
 * @swagger
 * /exercises/{id}:
 *   delete:
 *     summary: Supprimer un exercice
 *     tags: [Exercices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     responses:
 *       200:
 *         description: Exercice supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé
 */
router.delete('/:id', auth, deleteExercise);

/**
 * @swagger
 * tags:
 *   name: Séries et Répétitions
 *   description: Gestion des séries et répétitions pour les exercices
 */

/**
 * @swagger
 * /exercises/{exerciseId}/reps:
 *   post:
 *     summary: Créer un ensemble de séries et répétitions pour un exercice
 *     tags: [Séries et Répétitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sets
 *               - reps
 *               - weight
 *             properties:
 *               sets:
 *                 type: number
 *                 description: Nombre de séries
 *               reps:
 *                 type: number
 *                 description: Nombre de répétitions
 *               weight:
 *                 type: number
 *                 description: Poids utilisé en kg
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de l'enregistrement
 *     responses:
 *       201:
 *         description: Ensemble de séries et répétitions créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé
 */
router.post('/:exerciseId/reps', auth, createRepSet);

/**
 * @swagger
 * /exercises/{exerciseId}/reps/{repSetId}:
 *   get:
 *     summary: Obtenir un ensemble de séries et répétitions par son ID
 *     tags: [Séries et Répétitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'ensemble de séries et répétitions
 *     responses:
 *       200:
 *         description: Ensemble de séries et répétitions récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice ou ensemble de séries et répétitions non trouvé
 */
router.get('/:exerciseId/reps/:repSetId', auth, getRepSet);

/**
 * @swagger
 * /exercises/{exerciseId}/reps/{repSetId}:
 *   put:
 *     summary: Mettre à jour un ensemble de séries et répétitions
 *     tags: [Séries et Répétitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'ensemble de séries et répétitions
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
 *                 description: Poids utilisé en kg
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de l'enregistrement
 *     responses:
 *       200:
 *         description: Ensemble de séries et répétitions mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice ou ensemble de séries et répétitions non trouvé
 */
router.put('/:exerciseId/reps/:repSetId', auth, updateRepSet);

/**
 * @swagger
 * /exercises/{exerciseId}/reps/{repSetId}:
 *   delete:
 *     summary: Supprimer un ensemble de séries et répétitions
 *     tags: [Séries et Répétitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *       - in: path
 *         name: repSetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'ensemble de séries et répétitions
 *     responses:
 *       200:
 *         description: Ensemble de séries et répétitions supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice ou ensemble de séries et répétitions non trouvé
 */
router.delete('/:exerciseId/reps/:repSetId', auth, deleteRepSet);

/**
 * @swagger
 * /exercises/{exerciseId}/reps:
 *   get:
 *     summary: Obtenir tous les ensembles de séries et répétitions d'un exercice
 *     tags: [Séries et Répétitions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'exercice
 *     responses:
 *       200:
 *         description: Liste des ensembles de séries et répétitions récupérée avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Exercice non trouvé
 */
router.get('/:exerciseId/reps', auth, getAllRepSets);

export default router;