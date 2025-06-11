// src/models/productModel.js
const { pool } = require('../config/db');

async function getAllProductos() {
  const [rows] = await pool.query(`
    SELECT p.*, c.Nombre AS CategoriaNombre, m.Nombre AS MarcaNombre
    FROM Producto p
    LEFT JOIN Categoria c ON p.CategoriaID = c.ID
    LEFT JOIN Marca m ON p.MarcaID = m.ID
  `);
  return rows;
}

async function getProductoById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM Producto WHERE ID = ?',
    [id]
  );
  return rows[0];
}

async function createProducto(data) {
  const {
    Descripcion,
    Forma_Farmaceutica,
    Concentracion,
    Via_Administracion,
    Nombre,
    Oferta,
    Precio_Compra,
    Precio_Venta,
    Stock,
    Receta,
    MarcaID,
    CategoriaID
  } = data;

  const [result] = await pool.query(
    `INSERT INTO Producto
       (Descripcion, Forma_Farmaceutica, Concentracion, Via_Administracion,
        Nombre, Oferta, Precio_Compra, Precio_Venta, Stock, Receta,
        MarcaID, CategoriaID)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Descripcion,
      Forma_Farmaceutica,
      Concentracion,
      Via_Administracion,
      Nombre,
      Oferta,
      Precio_Compra,
      Precio_Venta,
      Stock,
      Receta,
      MarcaID,
      CategoriaID
    ]
  );

  return { id: result.insertId, ...data };
}

async function updateProducto(id, data) {
  await pool.query(
    `UPDATE Producto SET
       Descripcion       = ?, 
       Forma_Farmaceutica = ?, 
       Concentracion     = ?, 
       Via_Administracion = ?,
       Nombre            = ?, 
       Oferta            = ?, 
       Precio_Compra     = ?,
       Precio_Venta      = ?, 
       Stock             = ?, 
       Receta            = ?,
       MarcaID           = ?, 
       CategoriaID       = ?
     WHERE ID = ?`,
    [
      data.Descripcion,
      data.Forma_Farmaceutica,
      data.Concentracion,
      data.Via_Administracion,
      data.Nombre,
      data.Oferta,
      data.Precio_Compra,
      data.Precio_Venta,
      data.Stock,
      data.Receta,
      data.MarcaID,
      data.CategoriaID,
      id
    ]
  );

  // Asegúrate de devolver el id como número
  return { id: Number(id), ...data };
}

async function deleteProducto(id) {
  await pool.query('DELETE FROM Producto WHERE ID = ?', [id]);
}

async function getProductosStockCritico() {
  // Devolver la lista de productos con stock crítico (<= 5)
  const [rows] = await pool.query('SELECT * FROM Producto WHERE Stock <= 5');
  return rows;
}

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosStockCritico
};
