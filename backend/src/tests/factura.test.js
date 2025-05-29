const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Facturas API', () => {
  let token;
  let clienteId;
  let marcaId;
  let categoriaId;
  let prodNoRecId;
  let prodRecId;
  let facturaId;
  let rolId;
  let personalUserId;
  let userId;

  beforeAll(async () => {
    // Seed Rol, Personal y Usuario para ForeignKey en Factura
    const [r] = await pool.query('INSERT INTO Rol (Nombre, Descripcion) VALUES (?, ?)', ['testRole', 'desc']);
    rolId = r.insertId;
    const [pu] = await pool.query(
      'INSERT INTO Personal (CI, Nombre, Sexo, Telefono, Correo, Domicilio) VALUES (?, ?, ?, ?, ?, ?)',
      ['000', 'UsrTest', 'M', '000-0000', 'usr@test.com', 'Dir']
    );
    personalUserId = pu.insertId;
    // Insert user and get auto-generated ID
    const [u] = await pool.query(
      'INSERT INTO Usuario (Usuario, Contraseña, PersonalID, RolID) VALUES (?, ?, ?, ?)',
      ['testuser', 'testpass', personalUserId, rolId]
    );
    userId = u.insertId;
    token = jwt.sign({ id: userId, role: 'admin' }, process.env.JWT_SECRET);
    // seed Marca y Categoria
    const [m] = await pool.query('INSERT INTO Marca (Nombre) VALUES (?)', ['TestMarca']);
    marcaId = m.insertId;
    const [c] = await pool.query('INSERT INTO Categoria (Nombre) VALUES (?)', ['TestCat']);
    categoriaId = c.insertId;
    // seed Cliente
    const [cl] = await pool.query(
      'INSERT INTO Cliente (Nombre, Telefono, Domicilio, Email) VALUES (?, ?, ?, ?)',
      ['CliTest', '555-0000', 'DirTest', 'cli@test.com']
    );
    clienteId = cl.insertId;
    // seed Productos
    const [p1] = await pool.query(
      `INSERT INTO Producto (Descripcion, Forma_Farmaceutica, Concentracion, Via_Administracion, Nombre, Oferta, Precio_Compra, Precio_Venta, Stock, Receta, MarcaID, CategoriaID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Desc1','Tableta','100mg','Oral','ProdNoRec',false,10,15,5,false,marcaId,categoriaId]
    );
    prodNoRecId = p1.insertId;
    const [p2] = await pool.query(
      `INSERT INTO Producto (Descripcion, Forma_Farmaceutica, Concentracion, Via_Administracion, Nombre, Oferta, Precio_Compra, Precio_Venta, Stock, Receta, MarcaID, CategoriaID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['Desc2','Jarabe','50ml','Oral','ProdRec',false,20,30,5,true,marcaId,categoriaId]
    );
    prodRecId = p2.insertId;
  });

  afterAll(async () => {
    // cleanup facturas y detalles primero
    if (facturaId) {
      await pool.query('DELETE FROM Detalle_Nota_Venta WHERE FacturaID = ?', [facturaId]);
      await pool.query('DELETE FROM Factura WHERE ID = ?', [facturaId]);
    }
    // cleanup creado Usuario, Personal y Rol
    // eliminar entradas de bitacora para este usuario
    if (userId) await pool.query('DELETE FROM Bitacora WHERE UsuarioID = ?', [userId]);
    if (userId) await pool.query('DELETE FROM Usuario WHERE ID = ?', [userId]);
    if (personalUserId) await pool.query('DELETE FROM Personal WHERE ID = ?', [personalUserId]);
    if (rolId) await pool.query('DELETE FROM Rol WHERE ID = ?', [rolId]);
    // cleanup productos, cliente, marca, categoria
    await pool.query('DELETE FROM Producto WHERE ID IN (?, ?)', [prodNoRecId, prodRecId]);
    await pool.query('DELETE FROM Cliente WHERE ID = ?', [clienteId]);
    await pool.query('DELETE FROM Marca WHERE ID = ?', [marcaId]);
    await pool.query('DELETE FROM Categoria WHERE ID = ?', [categoriaId]);
    await pool.end();
  });

  test('POST /api/facturas should register a valid sale', async () => {
    const items = [
      { productoID: prodNoRecId, cantidad: 2 },
      { productoID: prodRecId, cantidad: 1, recetaCodigo: 'R-001' }
    ];
    const res = await request(app)
      .post('/api/facturas')
      .set('Authorization', `Bearer ${token}`)
      .send({ clienteID: clienteId, items });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('facturaID');
    expect(res.body).toHaveProperty('montoTotal', 15*2 + 30*1);
    facturaId = res.body.facturaID;
  });

  test('POST /api/facturas should fail on stock insuficiente', async () => {
    const res = await request(app)
      .post('/api/facturas')
      .set('Authorization', `Bearer ${token}`)
      .send({ clienteID: clienteId, items: [{ productoID: prodNoRecId, cantidad: 999 }] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Stock insuficiente');
  });

  test('POST /api/facturas should fail on missing recetaCodigo', async () => {
    const res = await request(app)
      .post('/api/facturas')
      .set('Authorization', `Bearer ${token}`)
      .send({ clienteID: clienteId, items: [{ productoID: prodRecId, cantidad: 1 }] });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Receta requerida');
  });
});