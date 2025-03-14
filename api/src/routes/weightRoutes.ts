import express from 'express';
import { addWeight, getWeightHistory, updateWeight, deleteWeight } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Poids
 *   description: Gestion de l'historique des poids
 */

router.use(auth);

/**
 * @swagger
 * /api/weight:
 *   post:
 *     summary: Ajouter une nouvelle entrée de poids
 *     tags: [Poids]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Poids en kg
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de l'enregistrement (par défaut à la date actuelle)
 *     responses:
 *       201:
 *         description: Entrée de poids ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeightDetail'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.post('/', addWeight);

/**
 * @swagger
 * /api/weight:
 *   get:
 *     summary: Obtenir l'historique des poids
 *     tags: [Poids]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des poids récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeightDetail'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/', getWeightHistory);

/**
 * @swagger
 * /api/weight/{entryId}:
 *   put:
 *     summary: Mettre à jour une entrée de poids
 *     tags: [Poids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entrée de poids
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *               - date
 *             properties:
 *               weight:
 *                 type: number
 *                 description: Poids en kg
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date de l'enregistrement
 *     responses:
 *       200:
 *         description: Entrée de poids mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WeightDetail'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur ou entrée de poids non trouvé
 */
router.put('/:entryId', updateWeight);

/**
 * @swagger
 * /api/weight/{entryId}:
 *   delete:
 *     summary: Supprimer une entrée de poids
 *     tags: [Poids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entrée de poids
 *     responses:
 *       200:
 *         description: Entrée de poids supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur ou entrée de poids non trouvé
 */
router.delete('/:entryId', deleteWeight);

export default router;