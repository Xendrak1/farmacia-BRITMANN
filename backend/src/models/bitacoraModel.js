// src/models/bitacoraModel.js
const { pool } = require('../config/db');

async function logAction(userId, action) {
  // Obtener la hora local de Bolivia (UTC-4)
  const now = new Date();
  // Crear fecha en zona horaria de Bolivia
  const boliviaTime = new Date(now.toLocaleString("en-US", {timeZone: "America/La_Paz"}));
  const fecha = boliviaTime.toISOString().split('T')[0];
  const hora = boliviaTime.toTimeString().split(' ')[0];
  
  console.log(`⏰ [BITÁCORA] Registrando: ${action} para usuario ${userId} - Fecha: ${fecha} Hora: ${hora}`);
  
  await pool.query(
    'INSERT INTO Bitacora (Fecha, Hora, Accion, UsuarioID) VALUES (?, ?, ?, ?)',
    [fecha, hora, action, userId]
  );
}

async function getAllBitacora() {
  const [rows] = await pool.query(`
    SELECT b.ID, 
           DATE_FORMAT(b.Fecha, '%Y-%m-%d') as Fecha, 
           b.Hora, 
           b.Accion, 
           b.UsuarioID, 
           u.Usuario as nombre
    FROM Bitacora b
    LEFT JOIN Usuario u ON b.UsuarioID = u.ID
    ORDER BY b.ID DESC
  `);
  return rows;
}

module.exports = { logAction, getAllBitacora };