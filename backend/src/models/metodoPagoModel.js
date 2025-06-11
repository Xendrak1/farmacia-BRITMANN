const { pool } = require('../config/db');

async function getAllMetodosPago() {
  const [rows] = await pool.query('SELECT ID, Nombre FROM Metodo_Pago');
  return rows;
}

module.exports = { getAllMetodosPago }; 