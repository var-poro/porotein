import { Router } from 'express';
import { createTag, getTag, updateTag, deleteTag, getAllTags } from '../controllers/tagController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Gestion des tags pour catégoriser les exercices
 */

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Créer un nouveau tag
 *     tags: [Tags]
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
 *                 description: Nom du tag
 *     responses:
 *       201:
 *         description: Tag créé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', auth, createTag);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Obtenir un tag par son ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Tag récupéré avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tag non trouvé
 */
router.get('/:id', auth, getTag);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Obtenir tous les tags
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tags récupérée avec succès
 *       401:
 *         description: Non authentifié
 */
router.get('/', auth, getAllTags);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     summary: Mettre à jour un tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nom du tag
 *     responses:
 *       200:
 *         description: Tag mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tag non trouvé
 */
router.put('/:id', auth, updateTag);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     summary: Supprimer un tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du tag
 *     responses:
 *       200:
 *         description: Tag supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tag non trouvé
 */
router.delete('/:id', auth, deleteTag);

export default router;