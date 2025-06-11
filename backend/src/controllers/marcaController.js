const { getAllMarcas } = require('../models/marcaModel');
const { logAction } = require('../models/bitacoraModel');

async function getMarcas(req, res) {
  try {
    const marcas = await getAllMarcas();
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Consultar marcas');
    }
    res.json(marcas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener marcas', error: err.message });
  }
}

module.exports = { getMarcas }; 