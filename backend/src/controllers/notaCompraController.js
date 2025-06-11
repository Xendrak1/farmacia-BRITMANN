const notaCompraModel = require('../models/notaCompraModel');
const { logAction } = require('../models/bitacoraModel');

exports.getAllNotasCompra = async (req, res) => {
  try {
    const notas = await notaCompraModel.getAllNotasCompra();
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotaCompraById = async (req, res) => {
  try {
    const nota = await notaCompraModel.getNotaCompraById(req.params.id);
    if (!nota) return res.status(404).json({ error: 'Nota de compra no encontrada' });
    res.json(nota);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDetallesNotaCompra = async (req, res) => {
  try {
    const detalles = await notaCompraModel.getDetallesNotaCompra(req.params.id);
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNotaCompra = async (req, res) => {
  try {
    const id = await notaCompraModel.createNotaCompra(req.body);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Registrar nota de compra');
    }
    res.status(201).json({ message: 'Nota de compra registrada', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotasCompraByProveedor = async (req, res) => {
  try {
    const notas = await notaCompraModel.getNotasCompraByProveedor(req.params.proveedorId);
    res.json(notas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 