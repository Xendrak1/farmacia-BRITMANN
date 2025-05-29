const request = require('supertest');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const app = require('../app');

describe('Permisos API', () => {
  let token;
  let roleId;
  let privId;
  let permiso;

  beforeAll(async () => {
    token = jwt.sign({ id: 1, role: 'admin' }, process.env.JWT_SECRET);
    const [r] = await pool.query('INSERT INTO Rol (Nombre, Descripcion) VALUES (?, ?)', ['PermRole', 'desc']);
    roleId = r.insertId;
    const [p] = await pool.query('INSERT INTO Privilegio (Descripcion) VALUES (?)', ['PermDesc']);
    privId = p.insertId;
  });

  afterAll(async () => {
    // cleanup permiso
    if (permiso) await pool.query('DELETE FROM Permiso WHERE RolID = ? AND PrivilegioID = ?', [roleId, privId]);
    // cleanup seeded role/privilegio
    await pool.query('DELETE FROM Rol WHERE ID = ?', [roleId]);
    await pool.query('DELETE FROM Privilegio WHERE ID = ?', [privId]);
    await pool.end();
  });

  test('GET /api/permisos should return array', async () => {
    const res = await request(app)
      .get('/api/permisos')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /api/permisos should create permiso', async () => {
    const res = await request(app)
      .post('/api/permisos')
      .set('Authorization', `Bearer ${token}`)
      .send({ rolId: roleId, privilegioId: privId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({ rolId: roleId, privilegioId: privId });
    permiso = res.body;
  });

  test('GET /api/permisos/:rolId/:privilegioId should return permiso', async () => {
    const res = await request(app)
      .get(`/api/permisos/${roleId}/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('RolID', roleId);
    expect(res.body).toHaveProperty('PrivilegioID', privId);
  });

  test('DELETE /api/permisos/:rolId/:privilegioId should delete permiso', async () => {
    const res = await request(app)
      .delete(`/api/permisos/${roleId}/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
    const getRes = await request(app)
      .get(`/api/permisos/${roleId}/${privId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.statusCode).toBe(404);
  });
});