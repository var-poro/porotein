import { Router } from 'express';
import {
  createProgram,
  deleteProgram,
  getAllPrograms,
  getProgram,
  getSessionsByProgramId,
  updateProgram,
} from '../controllers/programController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Programmes
 *   description: Gestion des programmes d'entraînement
 */

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Créer un nouveau programme
 *     tags: [Programmes]
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
 *                 description: Nom du programme
 *               description:
 *                 type: string
 *                 description: Description du programme
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs de sessions associées
 *     responses:
 *       201:
 *         description: Programme créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createProgram);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Obtenir un programme par son ID
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme
 *     responses:
 *       200:
 *         description: Programme récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme non trouvé
 */
router.get('/:id', auth, getProgram);

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Obtenir tous les programmes
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des programmes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllPrograms);

/**
 * @swagger
 * /programs/{id}:
 *   put:
 *     summary: Mettre à jour un programme
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du programme
 *               description:
 *                 type: string
 *                 description: Description du programme
 *               sessions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des IDs de sessions associées
 *     responses:
 *       200:
 *         description: Programme mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme non trouvé
 */
router.put('/:id', auth, updateProgram);

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Supprimer un programme
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme
 *     responses:
 *       200:
 *         description: Programme supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme non trouvé
 */
router.delete('/:id', auth, deleteProgram);

/**
 * @swagger
 * /programs/{programId}/sessions:
 *   get:
 *     summary: Obtenir toutes les sessions d'un programme
 *     tags: [Programmes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du programme
 *     responses:
 *       200:
 *         description: Sessions du programme récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Programme non trouvé
 */
router.get('/:programId/sessions', auth, getSessionsByProgramId);

export default router;