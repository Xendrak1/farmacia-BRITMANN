// src/models/roleModel.js
const { pool } = require('../config/db');

async function getAllRoles() {
  const [rows] = await pool.query('SELECT * FROM Rol');
  return rows;
}

async function getRoleById(id) {
  const [rows] = await pool.query('SELECT * FROM Rol WHERE ID = ?', [id]);
  return rows[0];
}

async function createRole(data) {
  const { Nombre, Descripcion } = data;
  const [result] = await pool.query(
    'INSERT INTO Rol (Nombre, Descripcion) VALUES (?, ?)',
    [Nombre, Descripcion]
  );
  return { ID: result.insertId, ...data };
}

async function updateRole(id, data) {
  const { Nombre, Descripcion } = data;
  await pool.query(
    'UPDATE Rol SET Nombre = ?, Descripcion = ? WHERE ID = ?',
    [Nombre, Descripcion, id]
  );
  return { ID: Number(id), ...data };
}

async function deleteRole(id) {
  await pool.query('DELETE FROM Rol WHERE ID = ?', [id]);
}

module.exports = { getAllRoles, getRoleById, createRole, updateRole, deleteRole };