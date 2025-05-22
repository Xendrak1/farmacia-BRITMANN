// src/models/bitacoraModel.js
const { pool } = require('../config/db');

async function logAction(userId, action) {
  const now = new Date();
  const fecha = now.toISOString().split('T')[0];
  const hora = now.toTimeString().split(' ')[0];
  await pool.query(
    'INSERT INTO Bitacora (Fecha, Hora, Accion, UsuarioID) VALUES (?, ?, ?, ?)',
    [fecha, hora, action, userId]
  );
}

module.exports = { logAction };