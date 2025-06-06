const metodoPagoModel = require('../models/metodoPagoModel');

async function getAllMetodosPago(req, res, next) {
  try {
    const metodos = await metodoPagoModel.getAllMetodosPago();
    res.json(metodos);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMetodosPago }; 