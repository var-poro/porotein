import {Router} from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateCurrentUser,
  updateUser,
  addWeight,
  getWeightHistory,
  updateWeight,
  deleteWeight,
  resendActivationEmail,
  resetPassword,
  toggleUserStatus,
  restoreUser
} from '../controllers/userController';
import {auth, isAdmin} from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/', auth, isAdmin, createUser);

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Obtenir l'utilisateur actuellement connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/current', auth, getCurrentUser);

/**
 * @swagger
 * /users/current:
 *   put:
 *     summary: Mettre à jour l'utilisateur actuellement connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/current', auth, updateCurrentUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par son ID (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', auth, isAdmin, getUserById);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtenir tous les utilisateurs (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.get('/', auth, isAdmin, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur par son ID (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', auth, isAdmin, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par son ID (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', auth, isAdmin, deleteUser);

// Routes pour le poids
router.post('/weight', auth, addWeight);
router.get('/weight', auth, getWeightHistory);
router.put('/weight/:id', auth, updateWeight);
router.delete('/weight/:id', auth, deleteWeight);

/**
 * @swagger
 * /users/{id}/resend-activation:
 *   post:
 *     summary: Renvoyer l'email d'activation (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email d'activation envoyé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/:id/resend-activation', auth, isAdmin, resendActivationEmail);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe d'un utilisateur (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/:id/reset-password', auth, isAdmin, resetPassword);

/**
 * @swagger
 * /users/{id}/status:
 *   put:
 *     summary: Activer/désactiver un utilisateur (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Statut de l'utilisateur mis à jour avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.put('/:id/status', auth, isAdmin, toggleUserStatus);

/**
 * @swagger
 * /users/{id}/restore:
 *   post:
 *     summary: Restaurer un utilisateur supprimé (admin)
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur restauré avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 */
router.post('/:id/restore', auth, isAdmin, restoreUser);

export default router;