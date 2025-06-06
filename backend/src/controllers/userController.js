const userModel = require('../models/userModel');

async function getAllUsers(req, res, next) {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) { next(err); }
}

async function getUserById(req, res, next) {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) { next(err); }
}

async function createUser(req, res, next) {
  try {
    const data = req.body;
    const newUser = await userModel.createUser(data);
    res.status(201).json(newUser);
  } catch (err) { next(err); }
}

async function updateUser(req, res, next) {
  try {
    const updated = await userModel.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
}

async function deleteUser(req, res, next) {
  try {
    await userModel.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };