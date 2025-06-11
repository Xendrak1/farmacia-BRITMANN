const productModel = require('../models/productModel');
const { pool } = require('../config/db');
const { logAction } = require('../models/bitacoraModel');

async function getAllProductos(req, res, next) {
  try {
    const productos = await productModel.getAllProductos();
    res.json(productos);
  } catch (err) {
    next(err);
  }
}

async function getProductoById(req, res, next) {
  try {
    const producto = await productModel.getProductoById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    next(err);
  }
}

async function createProducto(req, res, next) {
  console.log('createProducto req.body:', req.body);
  try {
    const newProducto = await productModel.createProducto(req.body);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Crear producto');
    }
    res.status(201).json(newProducto);
  } catch (err) {
    console.error('Error in createProducto:', err);
    next(err);
  }
}

async function updateProducto(req, res, next) {
  try {
    const updated = await productModel.updateProducto(req.params.id, req.body);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Actualizar producto');
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProducto(req, res, next) {
  try {
    await productModel.deleteProducto(req.params.id);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Eliminar producto');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getProductosStockCritico(req, res, next) {
  try {
    const productos = await productModel.getProductosStockCritico();
    res.json(productos);
  } catch (err) { next(err); }
}

// Endpoint para formas farmacéuticas únicas
async function getFormasFarmaceuticas(req, res) {
  try {
    const [rows] = await pool.query('SELECT DISTINCT Forma_Farmaceutica FROM Producto WHERE Forma_Farmaceutica IS NOT NULL AND Forma_Farmaceutica != ""');
    res.json(rows.map(r => r.Forma_Farmaceutica));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener formas farmacéuticas', error: err.message });
  }
}

// Endpoint para vías de administración únicas
async function getViasAdministracion(req, res) {
  try {
    const [rows] = await pool.query('SELECT DISTINCT Via_Administracion FROM Producto WHERE Via_Administracion IS NOT NULL AND Via_Administracion != ""');
    res.json(rows.map(r => r.Via_Administracion));
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener vías de administración', error: err.message });
  }
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosStockCritico,
  getFormasFarmaceuticas,
  getViasAdministracion
};