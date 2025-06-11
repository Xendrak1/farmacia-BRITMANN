const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Listar todos los proveedores
router.get('/', proveedorController.getAllProveedores);
// Buscar proveedor por nombre
router.get('/buscar', proveedorController.searchProveedorByName);
// Obtener proveedor por ID
router.get('/:id', proveedorController.getProveedorById);
// Crear proveedor
router.post('/', proveedorController.createProveedor);
// Actualizar proveedor
router.put('/:id', proveedorController.updateProveedor);
// Eliminar proveedor
router.delete('/:id', proveedorController.deleteProveedor);

module.exports = router; 