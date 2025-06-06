const facturaModel = require('../models/facturaModel');

async function registerVenta(req, res, next) {
  try {
    const { clienteID, items, usuarioID, metodoPagoID } = req.body;
    if (!clienteID || !items || !usuarioID || !metodoPagoID) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para la venta' });
    }
    const result = await facturaModel.registerVenta({ clienteID, items, usuarioID, metodoPagoID });
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

async function getVentasDelDia(req, res, next) {
  try {
    const data = await facturaModel.getVentasDelDia();
    res.json(data);
  } catch (err) { next(err); }
}

async function getVentasPorVendedorHoy(req, res, next) {
  try {
    const data = await facturaModel.getVentasPorVendedorHoy();
    res.json(data);
  } catch (err) { next(err); }
}

async function getCrecimientoMensual(req, res, next) {
  try {
    const data = await facturaModel.getCrecimientoMensual();
    res.json(data);
  } catch (err) { next(err); }
}

module.exports = {
  registerVenta,
  getAllFacturas,
  getFacturaById,
  getVentasDelDia,
  getVentasPorVendedorHoy,
  getCrecimientoMensual
};