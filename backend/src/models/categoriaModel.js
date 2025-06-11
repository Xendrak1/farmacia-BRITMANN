const { pool } = require('../config/db');

async function getAllCategorias() {
  const [rows] = await pool.query('SELECT * FROM Categoria ORDER BY Nombre');
  return rows;
}

async function getProductosPorCategoria(categoriaId) {
  const [rows] = await pool.query('SELECT * FROM Producto WHERE CategoriaID = ?', [categoriaId]);
  return rows;
}

async function getReporteStockPorCategoria() {
  const [rows] = await pool.query(`
    SELECT 
      c.ID AS CategoriaID,
      c.Nombre AS Categoria,
      COUNT(p.ID) AS TotalProductos,
      SUM(p.Stock) AS StockTotal,
      SUM(p.Stock * p.Precio_Venta) AS ValorTotal,
      SUM(CASE WHEN p.Stock = 0 THEN 1 ELSE 0 END) AS SinStock,
      SUM(CASE WHEN p.Stock > 0 AND p.Stock <= 5 THEN 1 ELSE 0 END) AS StockBajo
    FROM Categoria c
    LEFT JOIN Producto p ON c.ID = p.CategoriaID
    GROUP BY c.ID, c.Nombre
    ORDER BY c.Nombre
  `);
  return rows;
}

async function createCategoria(data) {
  const { Nombre } = data;
  const [result] = await pool.query(
    'INSERT INTO Categoria (Nombre) VALUES (?)',
    [Nombre]
  );
  return result.insertId;
}

async function updateCategoria(id, data) {
  const { Nombre } = data;
  const [result] = await pool.query(
    'UPDATE Categoria SET Nombre = ? WHERE ID = ?',
    [Nombre, id]
  );
  return result.affectedRows > 0;
}

async function deleteCategoria(id) {
  const [result] = await pool.query('DELETE FROM Categoria WHERE ID = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = { 
  getAllCategorias, 
  getProductosPorCategoria, 
  getReporteStockPorCategoria,
  createCategoria,
  updateCategoria,
  deleteCategoria
}; 