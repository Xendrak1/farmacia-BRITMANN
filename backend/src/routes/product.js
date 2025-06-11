const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API de Productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Listar productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/formas-farmaceuticas', productController.getFormasFarmaceuticas);
router.get('/vias-administracion', productController.getViasAdministracion);

// Dashboard metric: productos con stock crítico (debe ir antes de /:id)
router.get('/stock-critico', verifyToken, productController.getProductosStockCritico);

router.get('/', verifyToken, productController.getAllProductos);

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Productos]
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
 *         description: Producto obtenido
 */
router.get('/:id', verifyToken, productController.getProductoById);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear producto
 *     tags: [Productos]
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
 *               Precio_Venta:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post('/', verifyToken, productController.createProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
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
 *             properties:
 *               Nombre:
 *                 type: string
 *               Precio_Venta:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/:id', verifyToken, productController.updateProducto);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Productos]
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
 *         description: Producto eliminado
 */
router.delete('/:id', verifyToken, productController.deleteProducto);

module.exports = router;