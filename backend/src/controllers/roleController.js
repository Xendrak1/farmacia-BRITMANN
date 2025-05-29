const roleModel = require('../models/roleModel');

async function getAllRoles(req, res, next) {
  try {
    const roles = await roleModel.getAllRoles();
    res.json(roles);
  } catch (err) { next(err); }
}

async function getRoleById(req, res, next) {
  try {
    const rol = await roleModel.getRoleById(req.params.id);
    if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(rol);
  } catch (err) { next(err); }
}

async function createRole(req, res, next) {
  try {
    const newRol = await roleModel.createRole(req.body);
    res.status(201).json(newRol);
  } catch (err) { next(err); }
}

async function updateRole(req, res, next) {
  try {
    const updated = await roleModel.updateRole(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteRole(req, res, next) {
  try {
    await roleModel.deleteRole(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };