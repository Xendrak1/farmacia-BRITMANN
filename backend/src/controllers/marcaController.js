const { getAllMarcas } = require('../models/marcaModel');

async function getMarcas(req, res) {
  try {
    const marcas = await getAllMarcas();
    res.json(marcas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener marcas', error: err.message });
  }
}

module.exports = { getMarcas }; 