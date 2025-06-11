const { getAllCategorias, getProductosPorCategoria, getReporteStockPorCategoria, createCategoria, updateCategoria, deleteCategoria } = require('../models/categoriaModel');
const { logAction } = require('../models/bitacoraModel');

async function getCategorias(req, res) {
  try {
    const categorias = await getAllCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
}

async function getProductosCategoria(req, res) {
  try {
    const categoriaId = req.params.id;
    const productos = await getProductosPorCategoria(categoriaId);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos de la categoría', error: err.message });
  }
}

async function getReporteStockCategoria(req, res) {
  try {
    const reporte = await getReporteStockPorCategoria();
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Consultar reporte de stock por categoría');
    }
    res.json(reporte);
  } catch (err) {
    res.status(500).json({ message: 'Error al generar reporte de stock por categoría', error: err.message });
  }
}

async function createCategoriaController(req, res) {
  try {
    const { Nombre } = req.body;
    
    if (!Nombre || !Nombre.trim()) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }

    const categoriaId = await createCategoria({ Nombre: Nombre.trim() });
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Categoría creada: ${Nombre} - ID: ${categoriaId}`);
    }
    
    res.status(201).json({ message: 'Categoría creada exitosamente', id: categoriaId });
  } catch (err) {
    console.error('Error creando categoría:', err);
    res.status(500).json({ message: 'Error al crear categoría', error: err.message });
  }
}

async function updateCategoriaController(req, res) {
  try {
    const { id } = req.params;
    const { Nombre } = req.body;
    
    if (!Nombre || !Nombre.trim()) {
      return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
    }

    const success = await updateCategoria(id, { Nombre: Nombre.trim() });
    
    if (!success) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Categoría actualizada: ID ${id} - ${Nombre}`);
    }
    
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (err) {
    console.error('Error actualizando categoría:', err);
    res.status(500).json({ message: 'Error al actualizar categoría', error: err.message });
  }
}

async function deleteCategoriaController(req, res) {
  try {
    const { id } = req.params;
    
    const success = await deleteCategoria(id);
    
    if (!success) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Categoría eliminada: ID ${id}`);
    }
    
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (err) {
    console.error('Error eliminando categoría:', err);
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
    } else {
      res.status(500).json({ message: 'Error al eliminar categoría', error: err.message });
    }
  }
}

module.exports = { 
  getCategorias, 
  getProductosCategoria, 
  getReporteStockCategoria,
  createCategoriaController,
  updateCategoriaController,
  deleteCategoriaController
}; 