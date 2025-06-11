const personalModel = require('../models/personalModel');

async function getAllPersonal(req, res, next) {
  try {
    const lista = await personalModel.getAllPersonal();
    res.json(lista);
  } catch (err) {
    next(err);
  }
}

async function getPersonalById(req, res, next) {
  try {
    const persona = await personalModel.getPersonalById(req.params.id);
    if (!persona) return res.status(404).json({ message: 'Personal no encontrado' });
    res.json(persona);
  } catch (err) {
    next(err);
  }
}

async function createPersonal(req, res, next) {
  try {
    const nueva = await personalModel.createPersonal(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
}

async function updatePersonal(req, res, next) {
  try {
    const upd = await personalModel.updatePersonal(req.params.id, req.body);
    res.json(upd);
  } catch (err) {
    next(err);
  }
}

async function deletePersonal(req, res, next) {
  try {
    await personalModel.deletePersonal(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllPersonal, getPersonalById, createPersonal, updatePersonal, deletePersonal };