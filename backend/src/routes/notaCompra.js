const express = require('express');
const router = express.Router();
const notaCompraController = require('../controllers/notaCompraController');

// Listar todas las notas de compra
router.get('/', notaCompraController.getAllNotasCompra);
// Registrar una nueva nota de compra
router.post('/', notaCompraController.createNotaCompra);
// Obtener una nota de compra por ID
router.get('/:id', notaCompraController.getNotaCompraById);
// Obtener detalles de una nota de compra
router.get('/:id/detalles', notaCompraController.getDetallesNotaCompra);
// Obtener notas de compra por proveedor
router.get('/proveedor/:proveedorId', notaCompraController.getNotasCompraByProveedor);

module.exports = router; 