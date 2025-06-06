const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Privilegios API', () => {
  let token;
  let privId;

  beforeAll(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    if (privId) await pool.query('DELETE FROM Privilegio WHERE ID = ?', [privId]);
    await pool.end();
  });

  test('GET /api/privilegios should return array', async () => {
    const res = await request(app)
      .get('/api/privilegios')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/privilegios should create privilege', async () => {
    const data = { Descripcion: 'TestPriv' };
    const res = await request(app)
      .post('/api/privilegios')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    privId = res.body.ID;
  });

  test('GET /api/privilegios/:id should return the privilege', async () => {
    const res = await request(app)
      .get(`/api/privilegios/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID', privId);
    expect(res.body).toHaveProperty('Descripcion', 'TestPriv');
  });

  test('PUT /api/privilegios/:id should update the privilege', async () => {
    const updated = { Descripcion: 'UpdatedPriv' };
    const res = await request(app)
      .put(`/api/privilegios/${privId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ID: privId, ...updated });
  });

  test('DELETE /api/privilegios/:id should delete the privilege', async () => {
    const res = await request(app)
      .delete(`/api/privilegios/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    const getRes = await request(app)
      .get(`/api/privilegios/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(404);
  });
});