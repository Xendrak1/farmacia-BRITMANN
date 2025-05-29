// src/models/permisoModel.js
const { pool } = require('../config/db');

async function getAllPermisos() {
  const [rows] = await pool.query('SELECT * FROM Permiso');
  return rows;
}

async function getPermiso(rolId, privilegioId) {
  const [rows] = await pool.query(
    'SELECT * FROM Permiso WHERE RolID = ? AND PrivilegioID = ?',
    [rolId, privilegioId]
  );
  return rows[0];
}

async function createPermiso({ rolId, privilegioId }) {
  const fecha = new Date().toISOString().split('T')[0];
  await pool.query(
    'INSERT INTO Permiso (RolID, PrivilegioID, Fecha) VALUES (?, ?, ?)',
    [rolId, privilegioId, fecha]
  );
  return { rolId, privilegioId, fecha };
}

async function deletePermiso(rolId, privilegioId) {
  await pool.query(
    'DELETE FROM Permiso WHERE RolID = ? AND PrivilegioID = ?',
    [rolId, privilegioId]
  );
}

module.exports = { getAllPermisos, getPermiso, createPermiso, deletePermiso };