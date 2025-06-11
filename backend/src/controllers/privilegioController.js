const privilegioModel = require('../models/privilegioModel');

async function getAllPrivilegios(req, res, next) {
  try {
    const privilegios = await privilegioModel.getAllPrivilegios();
    res.json(privilegios);
  } catch (err) { next(err); }
}

async function getPrivilegioById(req, res, next) {
  try {
    const p = await privilegioModel.getPrivilegioById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Privilegio no encontrado' });
    res.json(p);
  } catch (err) { next(err); }
}

async function createPrivilegio(req, res, next) {
  try {
    const newP = await privilegioModel.createPrivilegio(req.body);
    res.status(201).json(newP);
  } catch (err) { next(err); }
}

async function updatePrivilegio(req, res, next) {
  try {
    const updated = await privilegioModel.updatePrivilegio(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
}

async function deletePrivilegio(req, res, next) {
  try {
    await privilegioModel.deletePrivilegio(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAllPrivilegios, getPrivilegioById, createPrivilegio, updatePrivilegio, deletePrivilegio };