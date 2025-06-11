const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Clientes API', () => {
  let token;
  let clienteId;

  beforeAll(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    if (clienteId) {
      await pool.query('DELETE FROM Cliente WHERE ID = ?', [clienteId]);
    }
    await pool.end();
  });

  test('GET /api/clientes should return an array', async () => {
    const res = await request(app)
      .get('/api/clientes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/clientes should create a new cliente', async () => {
    const newCliente = {
      Nombre: 'Cliente Test',
      Telefono: '555-1111',
      Domicilio: 'Direccion Test',
      Email: 'cliente@test.com'
    };
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send(newCliente);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    clienteId = res.body.ID;
  });

  test('GET /api/clientes/:id should return the created cliente', async () => {
    const res = await request(app)
      .get(`/api/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID', clienteId);
    expect(res.body).toHaveProperty('Nombre', 'Cliente Test');
  });

  test('PUT /api/clientes/:id should update the cliente', async () => {
    const updated = { Nombre: 'Cliente Updated', Telefono: '555-2222', Domicilio: 'Nueva Direccion', Email: 'upd@cliente.com' };
    const res = await request(app)
      .put(`/api/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ID: clienteId, ...updated });
  });

  test('DELETE /api/clientes/:id should remove the cliente', async () => {
    const res = await request(app)
      .delete(`/api/clientes/${clienteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    const [rows] = await pool.query('SELECT * FROM Cliente WHERE ID = ?', [clienteId]);
    expect(rows).toHaveLength(0);
  });
});