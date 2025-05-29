const { pool } = require('../config/db');

async function registerVenta({ clienteID, items, usuarioID, metodoPagoID }) {
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
    // Insertar cabecera de factura con Metodo_PagoID
    const [resFac] = await conn.query(
      'INSERT INTO Factura (Fecha, Hora, Monto_Total, Descuento, UsuarioID, ClienteID, Metodo_PagoID) VALUES (?, ?, ?, 0, ?, ?, ?)',
      [fecha, hora, montoTotal, usuarioID, clienteID, metodoPagoID]
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
      const cantidadDescontar = Math.abs(Number(i.cantidad));
      console.log('Descontando del producto', i.productoID, 'cantidad:', cantidadDescontar);
      // await conn.query('UPDATE Producto SET Stock = Stock - ? WHERE ID = ?', [cantidadDescontar, i.productoID]);
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

async function getVentasDelDia() {
  const [rows] = await pool.query(`
    SELECT COUNT(*) as totalVentas, IFNULL(SUM(Monto_Total),0) as totalMonto
    FROM Factura
    WHERE Fecha = CURDATE()
  `);
  return rows[0];
}

async function getVentasPorVendedorHoy() {
  const [rows] = await pool.query(`
    SELECT UsuarioID, COUNT(*) as ventas, IFNULL(SUM(Monto_Total),0) as monto
    FROM Factura
    WHERE Fecha = CURDATE()
    GROUP BY UsuarioID
  `);
  return rows;
}

async function getCrecimientoMensual() {
  // Ventas del mes actual
  const [actual] = await pool.query(`
    SELECT IFNULL(SUM(Monto_Total),0) as total
    FROM Factura
    WHERE MONTH(Fecha) = MONTH(CURDATE()) AND YEAR(Fecha) = YEAR(CURDATE())
  `);
  // Ventas del mes anterior
  const [anterior] = await pool.query(`
    SELECT IFNULL(SUM(Monto_Total),0) as total
    FROM Factura
    WHERE MONTH(Fecha) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND YEAR(Fecha) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
  `);
  const totalActual = actual[0].total || 0;
  const totalAnterior = anterior[0].total || 0;
  let crecimiento = 0;
  if (totalAnterior > 0) {
    crecimiento = ((totalActual - totalAnterior) / totalAnterior) * 100;
  } else if (totalActual > 0) {
    crecimiento = 100;
  }
  return { totalActual, totalAnterior, crecimiento: Math.round(crecimiento) };
}

module.exports = { registerVenta, getAllFacturas, getFacturaById, getVentasDelDia, getVentasPorVendedorHoy, getCrecimientoMensual };