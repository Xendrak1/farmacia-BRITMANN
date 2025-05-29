const { getAllCategorias } = require('../models/categoriaModel');

async function getCategorias(req, res) {
  try {
    const categorias = await getAllCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message });
  }
}

module.exports = { getCategorias }; 