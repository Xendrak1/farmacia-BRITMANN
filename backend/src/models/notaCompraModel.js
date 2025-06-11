const { pool } = require('../config/db');

async function getAllNotasCompra() {
  const [rows] = await pool.query('SELECT NC.*, P.Nombre AS Proveedor FROM Nota_compra NC JOIN Proveedor P ON NC.ProveedorID = P.ID');
  return rows;
}

async function getNotaCompraById(id) {
  const [rows] = await pool.query('SELECT NC.*, P.Nombre AS Proveedor FROM Nota_compra NC JOIN Proveedor P ON NC.ProveedorID = P.ID WHERE NC.ID = ?', [id]);
  return rows[0];
}

async function getDetallesNotaCompra(notaCompraId) {
  const [rows] = await pool.query('SELECT DNC.*, PR.Nombre AS Producto FROM Detalle_Nota_Compra DNC JOIN Producto PR ON DNC.ProductoID = PR.ID WHERE DNC.NotaCompraID = ?', [notaCompraId]);
  return rows;
}

async function createNotaCompra(data) {
  const { Fecha, Hora, Monto_Total, UsuarioID, ProveedorID, detalles } = data;
  const [result] = await pool.query('INSERT INTO Nota_compra (Fecha, Hora, Monto_Total, UsuarioID, ProveedorID) VALUES (?, ?, ?, ?, ?)', [Fecha, Hora, Monto_Total, UsuarioID, ProveedorID]);
  const notaCompraId = result.insertId;
  if (detalles && detalles.length > 0) {
    const values = detalles.map(d => [notaCompraId, d.ProductoID, d.Cantidad, d.Costo, d.Importe]);
    await pool.query('INSERT INTO Detalle_Nota_Compra (NotaCompraID, ProductoID, Cantidad, Costo, Importe) VALUES ?', [values]);
  }
  return notaCompraId;
}

async function getNotasCompraByProveedor(proveedorId) {
  const [rows] = await pool.query('SELECT * FROM Nota_compra WHERE ProveedorID = ?', [proveedorId]);
  return rows;
}

module.exports = {
  getAllNotasCompra,
  getNotaCompraById,
  getDetallesNotaCompra,
  createNotaCompra,
  getNotasCompraByProveedor
}; 