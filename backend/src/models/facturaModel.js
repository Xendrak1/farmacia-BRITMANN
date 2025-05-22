const { pool } = require('../config/db');

async function registerVenta({ clienteID, items, usuarioID }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const ahora = new Date();
    const fecha = ahora.toISOString().split('T')[0];
    const hora = ahora.toTimeString().split(' ')[0];
    let montoTotal = 0;
    // Verificar stock y calcular total
    for (const i of items) {
      const [prodRows] = await conn.query('SELECT Precio_Venta, Stock, Receta FROM Producto WHERE ID = ?', [i.productoID]);
      if (!prodRows.length) throw { status: 400, message: 'Producto no encontrado' };
      const { Precio_Venta, Stock, Receta } = prodRows[0];
      // Si el producto requiere receta, validar recetaCodigo
      if (Receta && !i.recetaCodigo) throw { status: 400, message: 'Receta requerida' };
      if (Stock < i.cantidad) throw { status: 400, message: 'Stock insuficiente' };
      montoTotal += Precio_Venta * i.cantidad;
    }
    // Insertar cabecera de factura
    const [resFac] = await conn.query(
      'INSERT INTO Factura (Fecha, Hora, Monto_Total, Descuento, UsuarioID, ClienteID) VALUES (?, ?, ?, 0, ?, ?)',
      [fecha, hora, montoTotal, usuarioID, clienteID]
    );
    const facturaID = resFac.insertId;
    // Detalles y actualizar stock
    for (const i of items) {
      const [prodRows] = await conn.query('SELECT Precio_Venta, Stock FROM Producto WHERE ID = ?', [i.productoID]);
      const { Precio_Venta } = prodRows[0];
      const total = Precio_Venta * i.cantidad;
      await conn.query(
        'INSERT INTO Detalle_Nota_Venta (FacturaID, ProductoID, Cantidad, Precio, Total) VALUES (?, ?, ?, ?, ?)',
        [facturaID, i.productoID, i.cantidad, Precio_Venta, total]
      );
      await conn.query('UPDATE Producto SET Stock = Stock - ? WHERE ID = ?', [i.cantidad, i.productoID]);
    }
    await conn.commit();
    return { facturaID, montoTotal };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function getAllFacturas() {
  const [rows] = await pool.query('SELECT * FROM Factura');
  return rows;
}

async function getFacturaById(id) {
  const [facRows] = await pool.query('SELECT * FROM Factura WHERE ID = ?', [id]);
  if (!facRows.length) return null;
  const factura = facRows[0];
  const [detRows] = await pool.query('SELECT * FROM Detalle_Nota_Venta WHERE FacturaID = ?', [id]);
  factura.detalles = detRows;
  return factura;
}

module.exports = { registerVenta, getAllFacturas, getFacturaById };