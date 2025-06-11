// src/models/privilegioModel.js
const { pool } = require('../config/db');

async function getAllPrivilegios() {
  const [rows] = await pool.query('SELECT * FROM Privilegio');
  return rows;
}

async function getPrivilegioById(id) {
  const [rows] = await pool.query('SELECT * FROM Privilegio WHERE ID = ?', [id]);
  return rows[0];
}

async function createPrivilegio(data) {
  const { Descripcion } = data;
  const [res] = await pool.query(
    'INSERT INTO Privilegio (Descripcion) VALUES (?)',
    [Descripcion]
  );
  return { ID: res.insertId, Descripcion };
}

async function updatePrivilegio(id, data) {
  const { Descripcion } = data;
  await pool.query(
    'UPDATE Privilegio SET Descripcion = ? WHERE ID = ?',
    [Descripcion, id]
  );
  return { ID: Number(id), Descripcion };
}

async function deletePrivilegio(id) {
  await pool.query('DELETE FROM Privilegio WHERE ID = ?', [id]);
}

module.exports = { getAllPrivilegios, getPrivilegioById, createPrivilegio, updatePrivilegio, deletePrivilegio };