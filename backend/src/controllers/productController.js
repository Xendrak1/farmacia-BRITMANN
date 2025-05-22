const productModel = require('../models/productModel');

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
    res.status(201).json(newProducto);
  } catch (err) {
    console.error('Error in createProducto:', err);
    next(err);
  }
}

async function updateProducto(req, res, next) {
  try {
    const updated = await productModel.updateProducto(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteProducto(req, res, next) {
  try {
    await productModel.deleteProducto(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
};