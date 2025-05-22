const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const personalController = require('../controllers/personalController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Personal
 *   description: Gestión de Personal
 */

/**
 * @swagger
 * /api/personal:
 *   get:
 *     summary: Listar personal
 *     tags: [Personal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de personal
 */
router.get('/', verifyToken, personalController.getAllPersonal);

/**
 * @swagger
 * /api/personal/{id}:
 *   get:
 *     summary: Obtener personal por ID
 *     tags: [Personal]
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
 *         description: Datos del personal
 *       404:
 *         description: Personal no encontrado
 */
router.get('/:id', verifyToken, personalController.getPersonalById);

/**
 * @swagger
 * /api/personal:
 *   post:
 *     summary: Crear nuevo personal
 *     tags: [Personal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CI:
 *                 type: string
 *               Nombre:
 *                 type: string
 *               Sexo:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Correo:
 *                 type: string
 *               Domicilio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Personal creado
 */
router.post('/', verifyToken, personalController.createPersonal);

/**
 * @swagger
 * /api/personal/{id}:
 *   put:
 *     summary: Actualizar datos del personal
 *     tags: [Personal]
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
 *               CI:
 *                 type: string
 *               Nombre:
 *                 type: string
 *               Sexo:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Correo:
 *                 type: string
 *               Domicilio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Personal actualizado
 */
router.put('/:id', verifyToken, personalController.updatePersonal);

/**
 * @swagger
 * /api/personal/{id}:
 *   delete:
 *     summary: Eliminar personal
 *     tags: [Personal]
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
 *         description: Personal eliminado
 */
router.delete('/:id', verifyToken, personalController.deletePersonal);

module.exports = router;