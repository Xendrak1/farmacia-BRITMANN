const { pool } = require('../config/db');

async function getAllProveedores() {
  const [rows] = await pool.query('SELECT * FROM Proveedor');
  return rows;
}

async function getProveedorById(id) {
  const [rows] = await pool.query('SELECT * FROM Proveedor WHERE ID = ?', [id]);
  return rows[0];
}

async function createProveedor(data) {
  const { Nombre, Dirección, Telefono, E_mail } = data;
  const [result] = await pool.query('INSERT INTO Proveedor (Nombre, Dirección, Telefono, E_mail) VALUES (?, ?, ?, ?)', [Nombre, Dirección, Telefono, E_mail]);
  return result.insertId;
}

async function updateProveedor(id, data) {
  const { Nombre, Dirección, Telefono, E_mail } = data;
  await pool.query('UPDATE Proveedor SET Nombre = ?, Dirección = ?, Telefono = ?, E_mail = ? WHERE ID = ?', [Nombre, Dirección, Telefono, E_mail, id]);
}

async function deleteProveedor(id) {
  await pool.query('DELETE FROM Proveedor WHERE ID = ?', [id]);
}

async function searchProveedorByName(nombre) {
  const [rows] = await pool.query('SELECT * FROM Proveedor WHERE Nombre LIKE ?', [`%${nombre}%`]);
  return rows;
}

module.exports = {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  searchProveedorByName
}; 