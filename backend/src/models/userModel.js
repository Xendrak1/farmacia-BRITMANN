// src/models/userModel.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function getAllUsers() {
  const [rows] = await pool.query(`
    SELECT U.ID as id, U.Usuario as username, U.RolID as roleId, R.Nombre as role, U.PersonalID as personalId, P.Nombre as nombre
    FROM usuario U
    LEFT JOIN Rol R ON U.RolID = R.ID
    LEFT JOIN Personal P ON U.PersonalID = P.ID
  `);
  return rows;
}

async function getUserById(id) {
  const [rows] = await pool.query(
    'SELECT ID as id, Usuario as username, RolID as role, PersonalID as personalId FROM usuario WHERE ID = ?',
    [id]
  );
  return rows[0];
}

async function getUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT ID as id, Usuario as username, contrasena as password, RolID as role FROM usuario WHERE Usuario = ?',
    [username]
  );
  return rows[0];
}

async function createUser({ username, password, personalId, role }) {
  const hash = await bcrypt.hash(password, 10);
  const [res] = await pool.query(
    'INSERT INTO usuario (Usuario, contrasena, PersonalID, RolID) VALUES (?, ?, ?, ?)',
    [username, hash, personalId, role]
  );
  return { id: res.insertId, username, personalId, role };
}

async function updateUser(id, { username, password, personalId, role }) {
  const fields = [];
  const vals = [];
  if (username) { fields.push('Usuario = ?'); vals.push(username); }
  if (password) { const hash = await bcrypt.hash(password, 10); fields.push('contrasena = ?'); vals.push(hash); }
  if (personalId) { fields.push('PersonalID = ?'); vals.push(personalId); }
  if (role) { fields.push('RolID = ?'); vals.push(role); }
  if (fields.length === 0) return getUserById(id);
  vals.push(id);
  await pool.query(
    `UPDATE usuario SET ${fields.join(', ')} WHERE ID = ?`,
    vals
  );
  return getUserById(id);
}

async function deleteUser(id) {
  await pool.query('DELETE FROM usuario WHERE ID = ?', [id]);
}

module.exports = { getAllUsers, getUserById, getUserByUsername, createUser, updateUser, deleteUser };