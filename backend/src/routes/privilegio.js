const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const privilegioController = require('../controllers/privilegioController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Privilegios
 *   description: Gestión de Privilegios
 */

/**
 * @swagger
 * /api/privilegios:
 *   get:
 *     summary: Listar privilegios
 *     tags: [Privilegios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de privilegios
 */
router.get('/', verifyToken, privilegioController.getAllPrivilegios);

/**
 * @swagger
 * /api/privilegios/{id}:
 *   get:
 *     summary: Obtener privilegio por ID
 *     tags: [Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Privilegio encontrado
 *       404:
 *         description: Privilegio no encontrado
 */
router.get('/:id', verifyToken, privilegioController.getPrivilegioById);

/**
 * @swagger
 * /api/privilegios:
 *   post:
 *     summary: Crear nuevo privilegio
 *     tags: [Privilegios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Privilegio creado
 */
router.post('/', verifyToken, privilegioController.createPrivilegio);

/**
 * @swagger
 * /api/privilegios/{id}:
 *   put:
 *     summary: Actualizar privilegio
 *     tags: [Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Privilegio actualizado
 */
router.put('/:id', verifyToken, privilegioController.updatePrivilegio);

/**
 * @swagger
 * /api/privilegios/{id}:
 *   delete:
 *     summary: Eliminar privilegio
 *     tags: [Privilegios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Privilegio eliminado
 */
router.delete('/:id', verifyToken, privilegioController.deletePrivilegio);

module.exports = router;