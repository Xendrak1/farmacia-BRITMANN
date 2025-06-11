const metodoPagoModel = require('../models/metodoPagoModel');
const { logAction } = require('../models/bitacoraModel');

async function getAllMetodosPago(req, res, next) {
  try {
    const metodos = await metodoPagoModel.getAllMetodosPago();
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Consultar métodos de pago');
    }
    res.json(metodos);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMetodosPago }; 