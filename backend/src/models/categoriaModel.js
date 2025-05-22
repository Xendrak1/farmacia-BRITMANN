const { pool } = require('../config/db');

async function getAllCategorias() {
  const [rows] = await pool.query('SELECT * FROM Categoria');
  return rows;
}

module.exports = { getAllCategorias }; 