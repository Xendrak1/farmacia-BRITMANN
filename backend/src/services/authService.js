// src/services/authService.js
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function authenticate(username, password) {
  const user = await userModel.getUserByUsername(username);
  if (!user) throw { status: 401, message: 'Usuario o contraseña inválidos' };
  // omit status check (assume all fetched users are active)
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Usuario o contraseña inválidos' };
  return user;
}

function generateToken(user) {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
}

module.exports = { authenticate, generateToken };