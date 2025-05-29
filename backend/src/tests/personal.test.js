const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Personal API', () => {
  let token;
  let personaId;

  beforeAll(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    if (personaId) {
      await pool.query('DELETE FROM Personal WHERE ID = ?', [personaId]);
    }
    await pool.end();
  });

  test('GET /api/personal should return an array', async () => {
    const res = await request(app)
      .get('/api/personal')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/personal should create a new person', async () => {
    const newPersona = {
      CI: '12345678',
      Nombre: 'Test User',
      Sexo: 'M',
      Telefono: '555-0000',
      Correo: 'test@example.com',
      Domicilio: 'Test Address'
    };
    const res = await request(app)
      .post('/api/personal')
      .set('Authorization', `Bearer ${token}`)
      .send(newPersona);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    personaId = res.body.ID;
  });

  test('GET /api/personal/:id should return the created person', async () => {
    const res = await request(app)
      .get(`/api/personal/${personaId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID', personaId);
    expect(res.body).toHaveProperty('Nombre', 'Test User');
  });

  test('PUT /api/personal/:id should update the person', async () => {
    const updated = { Nombre: 'Updated User', CI: '1234', Sexo: 'F', Telefono: '555-1234', Correo: 'upd@example.com', Domicilio: 'New Address' };
    const res = await request(app)
      .put(`/api/personal/${personaId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ID: personaId, ...updated });
  });

  test('DELETE /api/personal/:id should remove the person', async () => {
    const res = await request(app)
      .delete(`/api/personal/${personaId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    // ensure it's deleted
    const check = await pool.query('SELECT * FROM Personal WHERE ID = ?', [personaId]);
    expect(check[0]).toHaveLength(0);
  });
});