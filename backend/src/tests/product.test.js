const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Productos API', () => {
  let token;
  let marcaId;
  let categoriaId;
  let productoId;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
    // seed Marca y Categoria
    const [resMarca] = await pool.query('INSERT INTO Marca (Nombre) VALUES (?)', ['TestMarca']);
    marcaId = resMarca.insertId;
    const [resCategoria] = await pool.query('INSERT INTO Categoria (Nombre) VALUES (?)', ['TestCat']);
    categoriaId = resCategoria.insertId;
  });

  afterAll(async () => {
    // cleanup
    await pool.query('DELETE FROM Producto WHERE ID = ?', [productoId]);
    await pool.query('DELETE FROM Marca WHERE ID = ?', [marcaId]);
    await pool.query('DELETE FROM Categoria WHERE ID = ?', [categoriaId]);
    await pool.end();
  });

  test('GET /api/productos should return array', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/productos should create product', async () => {
    const nuevo = {
      Descripcion: 'Test',
      Forma_Farmaceutica: 'Tableta',
      Concentracion: '500mg',
      Via_Administracion: 'Oral',
      Nombre: 'ProdTest',
      Oferta: false,
      Precio_Compra: 10.0,
      Precio_Venta: 15.0,
      Stock: 100,
      Receta: false,
      MarcaID: marcaId,
      CategoriaID: categoriaId
    };
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    productoId = res.body.id;
  });

  test('GET /api/productos/:id should return the product', async () => {
    const res = await request(app)
      .get(`/api/productos/${productoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID', productoId);
  });

  test('PUT /api/productos/:id should update the product', async () => {
    const updated = { Nombre: 'ProdTestUpdated', Precio_Venta: 20.0, Descripcion: 'Test', Forma_Farmaceutica: 'Tableta', Concentracion: '500mg', Via_Administracion: 'Oral', Oferta: false, Precio_Compra: 10.0, Stock: 100, Receta: false, MarcaID: marcaId, CategoriaID: categoriaId };
    const res = await request(app)
      .put(`/api/productos/${productoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: productoId, Nombre: 'ProdTestUpdated' });
  });

  test('DELETE /api/productos/:id should remove the product', async () => {
    const res = await request(app)
      .delete(`/api/productos/${productoId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});