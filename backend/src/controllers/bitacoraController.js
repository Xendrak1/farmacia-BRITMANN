const { getAllBitacora } = require('../models/bitacoraModel');

async function getBitacora(req, res, next) {
  try {
    const logs = await getAllBitacora();
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { getBitacora }; 