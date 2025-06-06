const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const permisoController = require('../controllers/permisoController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Permisos
 *   description: Gestión de Permisos (Roles vs Privilegios)
 */

/**
 * @swagger
 * /api/permisos:
 *   get:
 *     summary: Listar todos los permisos
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permisos
 */
router.get('/', verifyToken, permisoController.getAllPermisos);

/**
 * @swagger
 * /api/permisos/{rolId}/{privilegioId}:
 *   get:
 *     summary: Obtener un permiso por rol y privilegio
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: privilegioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Permiso encontrado
 *       404:
 *         description: Permiso no encontrado
 */
router.get('/:rolId/:privilegioId', verifyToken, permisoController.getPermiso);

/**
 * @swagger
 * /api/permisos:
 *   post:
 *     summary: Crear un nuevo permiso
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rolId:
 *                 type: integer
 *               privilegioId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Permiso creado
 */
router.post('/', verifyToken, permisoController.createPermiso);

/**
 * @swagger
 * /api/permisos/{rolId}/{privilegioId}:
 *   delete:
 *     summary: Eliminar un permiso
 *     tags: [Permisos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: privilegioId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Permiso eliminado
 */
router.delete('/:rolId/:privilegioId', verifyToken, permisoController.deletePermiso);

module.exports = router;