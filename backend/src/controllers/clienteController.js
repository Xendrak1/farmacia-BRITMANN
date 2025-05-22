const clienteModel = require('../models/clienteModel');

async function getAllClientes(req, res, next) {
  try {
    const clientes = await clienteModel.getAllClientes();
    res.json(clientes);
  } catch (err) {
    next(err);
  }
}

async function getClienteById(req, res, next) {
  try {
    const cliente = await clienteModel.getClienteById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (err) {
    next(err);
  }
}

async function createCliente(req, res, next) {
  try {
    const nuevo = await clienteModel.createCliente(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
}

async function updateCliente(req, res, next) {
  try {
    const upd = await clienteModel.updateCliente(req.params.id, req.body);
    res.json(upd);
  } catch (err) {
    next(err);
  }
}

async function deleteCliente(req, res, next) {
  try {
    await clienteModel.deleteCliente(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };