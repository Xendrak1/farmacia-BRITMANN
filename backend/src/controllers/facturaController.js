const facturaModel = require('../models/facturaModel');

async function registerVenta(req, res, next) {
  try {
    const usuarioID = req.user.id;
    const { clienteID, items } = req.body;
    const result = await facturaModel.registerVenta({ clienteID, items, usuarioID });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getAllFacturas(req, res, next) {
  try {
    const facturas = await facturaModel.getAllFacturas();
    res.json(facturas);
  } catch (err) {
    next(err);
  }
}

async function getFacturaById(req, res, next) {
  try {
    const factura = await facturaModel.getFacturaById(req.params.id);
    if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });
    res.json(factura);
  } catch (err) {
    next(err);
  }
}

module.exports = { registerVenta, getAllFacturas, getFacturaById };