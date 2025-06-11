const express = require('express');
const router = express.Router();
const notaSalidaController = require('../controllers/notaSalidaController');

// Listar todas las notas de salida
router.get('/', notaSalidaController.getAllNotasSalida);
// Registrar una nueva nota de salida
router.post('/', notaSalidaController.createNotaSalida);
// Obtener una nota de salida por ID
router.get('/:id', notaSalidaController.getNotaSalidaById);
// Actualizar una nota de salida
router.put('/:id', notaSalidaController.updateNotaSalida);
// Eliminar una nota de salida
router.delete('/:id', notaSalidaController.deleteNotaSalida);
// Obtener detalles de una nota de salida
router.get('/:id/detalles', notaSalidaController.getDetallesNotaSalida);

module.exports = router; 