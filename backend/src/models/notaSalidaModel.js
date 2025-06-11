const { pool } = require('../config/db');

async function getAllNotasSalida() {
  const [rows] = await pool.query(`
    SELECT 
      ns.ID,
      ns.Fecha,
      ns.Hora,
      ns.Motivo,
      ns.UsuarioID,
      u.Usuario as UsuarioNombre
    FROM Nota_de_Salida ns
    LEFT JOIN Usuario u ON ns.UsuarioID = u.ID
    ORDER BY ns.Fecha DESC, ns.Hora DESC
  `);
  
  // Para cada nota, obtener sus detalles
  for (let nota of rows) {
    const detalles = await getDetallesNotaSalida(nota.ID);
    nota.productos = detalles.map(d => ({
      producto: d.Producto,
      lote: d.Lote,
      cantidad: d.Cantidad,
      valor: d.ValorUnitario,
      observaciones: d.Observaciones
    }));
  }
  
  return rows;
}

async function getNotaSalidaById(id) {
  const [rows] = await pool.query(`
    SELECT 
      ns.ID,
      ns.Fecha,
      ns.Hora,
      ns.Motivo,
      ns.UsuarioID,
      u.Usuario as UsuarioNombre
    FROM Nota_de_Salida ns
    LEFT JOIN Usuario u ON ns.UsuarioID = u.ID
    WHERE ns.ID = ?
  `, [id]);
  
  if (rows.length === 0) return null;
  
  const nota = rows[0];
  const detalles = await getDetallesNotaSalida(nota.ID);
  nota.productos = detalles.map(d => ({
    producto: d.Producto,
    lote: d.Lote,
    cantidad: d.Cantidad,
    valor: d.ValorUnitario,
    observaciones: d.Observaciones
  }));
  
  return nota;
}

async function getDetallesNotaSalida(notaSalidaId) {
  const [rows] = await pool.query(`
    SELECT 
      dns.NotaSalidaID,
      dns.ProductoID,
      dns.Cantidad,
      dns.Lote,
      dns.ValorUnitario,
      dns.ValorTotal,
      dns.Observaciones,
      p.Nombre AS Producto
    FROM Detalle_Nota_Salida dns 
    JOIN Producto p ON dns.ProductoID = p.ID 
    WHERE dns.NotaSalidaID = ?
  `, [notaSalidaId]);
  return rows;
}

async function createNotaSalida(data) {
  const { Fecha, Hora, Motivo, productos, UsuarioID } = data;
  
  // Crear la nota de salida
  const [result] = await pool.query(`
    INSERT INTO Nota_de_Salida (Fecha, Hora, Motivo, UsuarioID) 
    VALUES (?, ?, ?, ?)
  `, [Fecha, Hora, Motivo || 'salida', UsuarioID]);
  
  const notaSalidaId = result.insertId;
  
  // Crear los detalles si existen productos
  if (productos && productos.length > 0) {
    for (const producto of productos) {
      // Buscar el ID del producto por nombre
      const [prodRows] = await pool.query('SELECT ID, Precio_Venta FROM Producto WHERE Nombre = ?', [producto.producto]);
      
      if (prodRows.length > 0) {
        const productoID = prodRows[0].ID;
        const valorUnitario = parseFloat(producto.valor) || prodRows[0].Precio_Venta || 0;
        const cantidad = parseInt(producto.cantidad) || 0;
        const valorTotal = valorUnitario * cantidad;
        
        await pool.query(`
          INSERT INTO Detalle_Nota_Salida 
          (NotaSalidaID, ProductoID, Cantidad, Lote, ValorUnitario, ValorTotal, Observaciones) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          notaSalidaId, 
          productoID, 
          cantidad, 
          producto.lote || '', 
          valorUnitario, 
          valorTotal, 
          producto.observaciones || ''
        ]);
      }
    }
  }
  
  return notaSalidaId;
}

async function updateNotaSalida(id, data) {
  const { Fecha, Hora, Motivo, productos, UsuarioID } = data;
  
  // Actualizar la nota de salida
  await pool.query(`
    UPDATE Nota_de_Salida 
    SET Fecha = ?, Hora = ?, Motivo = ?, UsuarioID = ?
    WHERE ID = ?
  `, [Fecha, Hora, Motivo || 'salida', UsuarioID, id]);
  
  // Eliminar detalles existentes
  await pool.query('DELETE FROM Detalle_Nota_Salida WHERE NotaSalidaID = ?', [id]);
  
  // Recrear los detalles si existen productos
  if (productos && productos.length > 0) {
    for (const producto of productos) {
      // Buscar el ID del producto por nombre
      const [prodRows] = await pool.query('SELECT ID, Precio_Venta FROM Producto WHERE Nombre = ?', [producto.producto]);
      
      if (prodRows.length > 0) {
        const productoID = prodRows[0].ID;
        const valorUnitario = parseFloat(producto.valor) || prodRows[0].Precio_Venta || 0;
        const cantidad = parseInt(producto.cantidad) || 0;
        const valorTotal = valorUnitario * cantidad;
        
        await pool.query(`
          INSERT INTO Detalle_Nota_Salida 
          (NotaSalidaID, ProductoID, Cantidad, Lote, ValorUnitario, ValorTotal, Observaciones) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          id, 
          productoID, 
          cantidad, 
          producto.lote || '', 
          valorUnitario, 
          valorTotal, 
          producto.observaciones || ''
        ]);
      }
    }
  }
  
  return true;
}

async function deleteNotaSalida(id) {
  // Primero eliminar los detalles
  await pool.query('DELETE FROM Detalle_Nota_Salida WHERE NotaSalidaID = ?', [id]);
  
  // Luego eliminar la nota
  const [result] = await pool.query('DELETE FROM Nota_de_Salida WHERE ID = ?', [id]);
  
  return result.affectedRows > 0;
}

module.exports = {
  getAllNotasSalida,
  getNotaSalidaById,
  getDetallesNotaSalida,
  createNotaSalida,
  updateNotaSalida,
  deleteNotaSalida
}; 