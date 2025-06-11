const { pool } = require('../config/db');

async function getAllMarcas() {
  const [rows] = await pool.query('SELECT * FROM Marca');
  return rows;
}

module.exports = { getAllMarcas }; 