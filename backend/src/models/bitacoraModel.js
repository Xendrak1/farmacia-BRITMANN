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

async function getAllBitacora() {
  const [rows] = await pool.query(`
    SELECT b.ID, b.Fecha, b.Hora, b.Accion, b.UsuarioID, u.Usuario as nombre
    FROM Bitacora b
    LEFT JOIN usuario u ON b.UsuarioID = u.ID
    ORDER BY b.Fecha DESC, b.Hora DESC
  `);
  return rows;
}

module.exports = { logAction, getAllBitacora };