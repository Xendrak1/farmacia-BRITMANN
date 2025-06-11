const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const facturaController = require('../controllers/facturaController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Facturas
 *   description: Gestión de facturas y ventas
 */

/**
 * @swagger
 * /api/facturas:
 *   post:
 *     summary: Registrar venta (crear factura)
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteID:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoID:
 *                       type: integer
 *                     cantidad:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Venta registrada
 */
router.post('/', verifyToken, facturaController.registerVenta);

/**
 * @swagger
 * /api/facturas:
 *   get:
 *     summary: Listar facturas
 *     tags: [Facturas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de facturas
 */
router.get('/', verifyToken, facturaController.getAllFacturas);

/**
 * @swagger
 * /api/facturas/{id}:
 *   get:
 *     summary: Obtener factura por ID
 *     tags: [Facturas]
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
 *         description: Datos de factura con detalles
 *       404:
 *         description: Factura no encontrada
 */
router.get('/:id', verifyToken, facturaController.getFacturaById);

// Dashboard metrics
router.get('/dashboard/ventas-dia', verifyToken, facturaController.getVentasDelDia);
router.get('/dashboard/ventas-vendedor-hoy', verifyToken, facturaController.getVentasPorVendedorHoy);
router.get('/dashboard/crecimiento-mensual', verifyToken, facturaController.getCrecimientoMensual);

module.exports = router;