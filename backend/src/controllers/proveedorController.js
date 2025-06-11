const proveedorModel = require('../models/proveedorModel');
const { logAction } = require('../models/bitacoraModel');

exports.getAllProveedores = async (req, res) => {
  try {
    const proveedores = await proveedorModel.getAllProveedores();
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProveedorById = async (req, res) => {
  try {
    const proveedor = await proveedorModel.getProveedorById(req.params.id);
    if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProveedor = async (req, res) => {
  try {
    const id = await proveedorModel.createProveedor(req.body);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Crear proveedor');
    }
    res.status(201).json({ message: 'Proveedor creado', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProveedor = async (req, res) => {
  try {
    await proveedorModel.updateProveedor(req.params.id, req.body);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Actualizar proveedor');
    }
    res.json({ message: 'Proveedor actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProveedor = async (req, res) => {
  try {
    await proveedorModel.deleteProveedor(req.params.id);
    if (req.user && req.user.id) {
      await logAction(req.user.id, 'Eliminar proveedor');
    }
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchProveedorByName = async (req, res) => {
  try {
    const nombre = req.query.nombre;
    if (!nombre) return res.status(400).json({ error: 'Falta el parámetro nombre' });
    const proveedores = await proveedorModel.searchProveedorByName(nombre);
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 