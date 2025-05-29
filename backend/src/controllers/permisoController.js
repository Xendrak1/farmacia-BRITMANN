const permisoModel = require('../models/permisoModel');

async function getAllPermisos(req, res, next) {
  try {
    const permisos = await permisoModel.getAllPermisos();
    res.json(permisos);
  } catch (err) { next(err); }
}

async function getPermiso(req, res, next) {
  try {
    const { rolId, privilegioId } = req.params;
    const p = await permisoModel.getPermiso(rolId, privilegioId);
    if (!p) return res.status(404).json({ message: 'Permiso no encontrado' });
    res.json(p);
  } catch (err) { next(err); }
}

async function createPermiso(req, res, next) {
  try {
    const { rolId, privilegioId } = req.body;
    const newP = await permisoModel.createPermiso({ rolId, privilegioId });
    res.status(201).json(newP);
  } catch (err) { next(err); }
}

async function deletePermiso(req, res, next) {
  try {
    const { rolId, privilegioId } = req.params;
    await permisoModel.deletePermiso(rolId, privilegioId);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAllPermisos, getPermiso, createPermiso, deletePermiso };