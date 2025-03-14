import { Router } from 'express';
import { createMuscle, getMuscle, updateMuscle, deleteMuscle, getAllMuscles } from '../controllers/muscleController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Muscles
 *   description: Gestion des muscles ciblés par les exercices
 */

/**
 * @swagger
 * /muscles:
 *   post:
 *     summary: Créer un nouveau muscle
 *     tags: [Muscles]
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
 *                 description: Nom du muscle
 *     responses:
 *       201:
 *         description: Muscle créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createMuscle);

/**
 * @swagger
 * /muscles/{id}:
 *   get:
 *     summary: Obtenir un muscle par son ID
 *     tags: [Muscles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du muscle
 *     responses:
 *       200:
 *         description: Muscle récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Muscle non trouvé
 */
router.get('/:id', auth, getMuscle);

/**
 * @swagger
 * /muscles:
 *   get:
 *     summary: Obtenir tous les muscles
 *     tags: [Muscles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des muscles récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllMuscles);

/**
 * @swagger
 * /muscles/{id}:
 *   put:
 *     summary: Mettre à jour un muscle
 *     tags: [Muscles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du muscle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du muscle
 *     responses:
 *       200:
 *         description: Muscle mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Muscle non trouvé
 */
router.put('/:id', auth, updateMuscle);

/**
 * @swagger
 * /muscles/{id}:
 *   delete:
 *     summary: Supprimer un muscle
 *     tags: [Muscles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du muscle
 *     responses:
 *       200:
 *         description: Muscle supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Muscle non trouvé
 */
router.delete('/:id', auth, deleteMuscle);

export default router;