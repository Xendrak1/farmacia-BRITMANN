const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

describe('Roles API', () => {
  let token;
  let roleId;

  beforeAll(() => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
  });

  test('GET /api/roles should return array', async () => {
    const res = await request(app)
      .get('/api/roles')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/roles should create a role', async () => {
    const data = { Nombre: 'TestRole', Descripcion: 'DescRole' };
    const res = await request(app)
      .post('/api/roles')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('ID');
    roleId = res.body.ID;
  });

  test('GET /api/roles/:id should return the role', async () => {
    const res = await request(app)
      .get(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ID', roleId);
    expect(res.body).toHaveProperty('Nombre', 'TestRole');
  });

  test('PUT /api/roles/:id should update the role', async () => {
    const updated = { Nombre: 'UpdatedRole', Descripcion: 'UpdatedDesc' };
    const res = await request(app)
      .put(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ ID: roleId, ...updated });
  });

  test('DELETE /api/roles/:id should delete the role', async () => {
    const res = await request(app)
      .delete(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    // then 404 on get
    const getRes = await request(app)
      .get(`/api/roles/${roleId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(404);
  });
});