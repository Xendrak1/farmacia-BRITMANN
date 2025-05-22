// src/models/clienteModel.js
const { pool } = require('../config/db');

async function getAllClientes() {
  const [rows] = await pool.query('SELECT * FROM Cliente');
  return rows;
}

async function getClienteById(id) {
  const [rows] = await pool.query('SELECT * FROM Cliente WHERE ID = ?', [id]);
  return rows[0];
}

async function createCliente(data) {
  const { Nombre, Telefono, Domicilio, Email } = data;
  const [result] = await pool.query(
    'INSERT INTO Cliente (Nombre, Telefono, Domicilio, Email) VALUES (?, ?, ?, ?)',
    [Nombre, Telefono, Domicilio, Email]
  );
  return { ID: result.insertId, ...data };
}

async function updateCliente(id, data) {
  const { Nombre, Telefono, Domicilio, Email } = data;
  await pool.query(
    'UPDATE Cliente SET Nombre = ?, Telefono = ?, Domicilio = ?, Email = ? WHERE ID = ?',
    [Nombre, Telefono, Domicilio, Email, id]
  );
  return { ID: Number(id), ...data };
}

async function deleteCliente(id) {
  await pool.query('DELETE FROM Cliente WHERE ID = ?', [id]);
}

module.exports = { getAllClientes, getClienteById, createCliente, updateCliente, deleteCliente };