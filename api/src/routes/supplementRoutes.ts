import { Router } from 'express';
import { createSupplement, getSupplement, updateSupplement, deleteSupplement, getAllSupplements } from '../controllers/supplementController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Supplements
 *   description: Gestion des suppléments nutritionnels
 */

/**
 * @swagger
 * /supplements:
 *   post:
 *     summary: Créer un nouveau supplément
 *     tags: [Supplements]
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
 *                 description: Nom du supplément
 *               description:
 *                 type: string
 *                 description: Description du supplément
 *               dosage:
 *                 type: string
 *                 description: Dosage recommandé
 *               timing:
 *                 type: string
 *                 description: Moment recommandé pour la prise
 *     responses:
 *       201:
 *         description: Supplément créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createSupplement);

/**
 * @swagger
 * /supplements/{id}:
 *   get:
 *     summary: Obtenir un supplément par son ID
 *     tags: [Supplements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du supplément
 *     responses:
 *       200:
 *         description: Supplément récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Supplément non trouvé
 */
router.get('/:id', auth, getSupplement);

/**
 * @swagger
 * /supplements:
 *   get:
 *     summary: Obtenir tous les suppléments
 *     tags: [Supplements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des suppléments récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllSupplements);

/**
 * @swagger
 * /supplements/{id}:
 *   put:
 *     summary: Mettre à jour un supplément
 *     tags: [Supplements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du supplément
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du supplément
 *               description:
 *                 type: string
 *                 description: Description du supplément
 *               dosage:
 *                 type: string
 *                 description: Dosage recommandé
 *               timing:
 *                 type: string
 *                 description: Moment recommandé pour la prise
 *     responses:
 *       200:
 *         description: Supplément mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Supplément non trouvé
 */
router.put('/:id', auth, updateSupplement);

/**
 * @swagger
 * /supplements/{id}:
 *   delete:
 *     summary: Supprimer un supplément
 *     tags: [Supplements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du supplément
 *     responses:
 *       200:
 *         description: Supplément supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Supplément non trouvé
 */
router.delete('/:id', auth, deleteSupplement);

export default router;