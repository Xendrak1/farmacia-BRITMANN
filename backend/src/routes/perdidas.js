const express = require('express');
const router = express.Router();
const perdidasController = require('../controllers/perdidasController');

// Listar todas las pérdidas
router.get('/', perdidasController.getAllPerdidas);

// Obtener estadísticas de pérdidas
router.get('/estadisticas', perdidasController.getEstadisticasPerdidas);

// Obtener pérdidas por tipo
router.get('/tipo/:tipo', perdidasController.getPerdidasByTipo);

// Obtener pérdida por ID
router.get('/:id', perdidasController.getPerdidaById);

// Crear nueva pérdida
router.post('/', perdidasController.createPerdida);

// Actualizar pérdida
router.put('/:id', perdidasController.updatePerdida);

// Eliminar pérdida
router.delete('/:id', perdidasController.deletePerdida);

module.exports = router; 