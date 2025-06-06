// src/models/personalModel.js
const { pool } = require('../config/db');

async function getAllPersonal() {
  const [rows] = await pool.query('SELECT * FROM Personal');
  return rows;
}

async function getPersonalById(id) {
  const [rows] = await pool.query('SELECT * FROM Personal WHERE ID = ?', [id]);
  return rows[0];
}

async function createPersonal(data) {
  const { CI, Nombre, Sexo, Telefono, Correo, Domicilio } = data;
  const [result] = await pool.query(
    `INSERT INTO Personal (CI, Nombre, Sexo, Telefono, Correo, Domicilio) VALUES (?, ?, ?, ?, ?, ?)`,
    [CI, Nombre, Sexo, Telefono, Correo, Domicilio]
  );
  return { ID: result.insertId, ...data };
}

async function updatePersonal(id, data) {
  const { CI, Nombre, Sexo, Telefono, Correo, Domicilio } = data;
  await pool.query(
    `UPDATE Personal SET CI = ?, Nombre = ?, Sexo = ?, Telefono = ?, Correo = ?, Domicilio = ? WHERE ID = ?`,
    [CI, Nombre, Sexo, Telefono, Correo, Domicilio, id]
  );
  return { ID: Number(id), ...data };
}

async function deletePersonal(id) {
  await pool.query('DELETE FROM Personal WHERE ID = ?', [id]);
}

module.exports = {
  getAllPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal
};