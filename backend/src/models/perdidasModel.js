const { pool } = require('../config/db');

async function getAllPerdidas() {
  const [rows] = await pool.query(`
    SELECT 
      p.ID,
      p.ProductoID,
      prod.Nombre as ProductoNombre,
      p.Cantidad,
      p.TipoPerdida,
      p.Fecha,
      p.Hora,
      p.Lote,
      p.ValorUnitario,
      p.ValorTotal,
      p.Motivo,
      p.UsuarioID,
      u.Usuario as UsuarioNombre
    FROM Perdidas p
    LEFT JOIN Producto prod ON p.ProductoID = prod.ID
    LEFT JOIN Usuario u ON p.UsuarioID = u.ID
    ORDER BY p.Fecha DESC, p.Hora DESC
  `);
  return rows;
}

async function getPerdidaById(id) {
  const [rows] = await pool.query(`
    SELECT 
      p.ID,
      p.ProductoID,
      prod.Nombre as ProductoNombre,
      p.Cantidad,
      p.TipoPerdida,
      p.Fecha,
      p.Hora,
      p.Lote,
      p.ValorUnitario,
      p.ValorTotal,
      p.Motivo,
      p.UsuarioID,
      u.Usuario as UsuarioNombre
    FROM Perdidas p
    LEFT JOIN Producto prod ON p.ProductoID = prod.ID
    LEFT JOIN Usuario u ON p.UsuarioID = u.ID
    WHERE p.ID = ?
  `, [id]);
  return rows[0];
}

async function createPerdida(data) {
  const { ProductoID, Cantidad, TipoPerdida, Fecha, Hora, Lote, ValorUnitario, Motivo, UsuarioID } = data;
  const ValorTotal = parseFloat(ValorUnitario) * parseInt(Cantidad);
  
  const [result] = await pool.query(`
    INSERT INTO Perdidas (ProductoID, Cantidad, TipoPerdida, Fecha, Hora, Lote, ValorUnitario, ValorTotal, Motivo, UsuarioID) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [ProductoID, Cantidad, TipoPerdida, Fecha, Hora, Lote, ValorUnitario, ValorTotal, Motivo, UsuarioID]);
  
  return result.insertId;
}

async function updatePerdida(id, data) {
  const { ProductoID, Cantidad, TipoPerdida, Fecha, Hora, Lote, ValorUnitario, Motivo, UsuarioID } = data;
  const ValorTotal = parseFloat(ValorUnitario) * parseInt(Cantidad);
  
  await pool.query(`
    UPDATE Perdidas 
    SET ProductoID = ?, Cantidad = ?, TipoPerdida = ?, Fecha = ?, Hora = ?, Lote = ?, ValorUnitario = ?, ValorTotal = ?, Motivo = ?, UsuarioID = ?
    WHERE ID = ?
  `, [ProductoID, Cantidad, TipoPerdida, Fecha, Hora, Lote, ValorUnitario, ValorTotal, Motivo, UsuarioID, id]);
}

async function deletePerdida(id) {
  await pool.query('DELETE FROM Perdidas WHERE ID = ?', [id]);
}

async function getPerdidasByTipo(tipo) {
  const [rows] = await pool.query(`
    SELECT 
      p.ID,
      p.ProductoID,
      prod.Nombre as ProductoNombre,
      p.Cantidad,
      p.TipoPerdida,
      p.Fecha,
      p.Hora,
      p.Lote,
      p.ValorUnitario,
      p.ValorTotal,
      p.Motivo,
      p.UsuarioID,
      u.Usuario as UsuarioNombre
    FROM Perdidas p
    LEFT JOIN Producto prod ON p.ProductoID = prod.ID
    LEFT JOIN Usuario u ON p.UsuarioID = u.ID
    WHERE p.TipoPerdida = ?
    ORDER BY p.Fecha DESC, p.Hora DESC
  `, [tipo]);
  return rows;
}

async function getEstadisticasPerdidas() {
  const [rows] = await pool.query(`
    SELECT 
      TipoPerdida,
      COUNT(*) as CantidadIncidentes,
      SUM(Cantidad) as TotalUnidades,
      SUM(ValorTotal) as TotalValor
    FROM Perdidas 
    GROUP BY TipoPerdida
  `);
  return rows;
}

module.exports = {
  getAllPerdidas,
  getPerdidaById,
  createPerdida,
  updatePerdida,
  deletePerdida,
  getPerdidasByTipo,
  getEstadisticasPerdidas
}; 