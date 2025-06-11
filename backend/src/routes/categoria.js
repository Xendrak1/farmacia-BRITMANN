const express = require('express');
const router = express.Router();
const { 
  getCategorias, 
  getProductosCategoria, 
  getReporteStockCategoria,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController
} = require('../controllers/categoriaController');

// Rutas de consulta
router.get('/', getCategorias);
router.get('/reporte-stock', getReporteStockCategoria);
router.get('/:id/productos', getProductosCategoria);

// Rutas CRUD
router.post('/', createCategoriaController);
router.put('/:id', updateCategoriaController);
router.delete('/:id', deleteCategoriaController);

module.exports = router; 