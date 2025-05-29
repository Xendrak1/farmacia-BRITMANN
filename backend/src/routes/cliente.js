const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const clienteController = require('../controllers/clienteController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Gestión de Clientes
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', verifyToken, clienteController.getAllClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     tags: [Clientes]
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
 *         description: Datos del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/:id', verifyToken, clienteController.getClienteById);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear nuevo cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Domicilio:
 *                 type: string
 *               Email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
router.post('/', clienteController.createCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar cliente
 *     tags: [Clientes]
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
 *               Nombre:
 *                 type: string
 *               Telefono:
 *                 type: string
 *               Domicilio:
 *                 type: string
 *               Email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 */
router.put('/:id', clienteController.updateCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar cliente
 *     tags: [Clientes]
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
 *         description: Cliente eliminado
 */
router.delete('/:id', verifyToken, clienteController.deleteCliente);

module.exports = router;