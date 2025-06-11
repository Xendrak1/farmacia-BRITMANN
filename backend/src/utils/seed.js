// src/utils/seed.js
const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

async function seedRoles() {
  const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM Rol');
  if (rows[0].cnt === 0) {
    await pool.query(
      `INSERT INTO Rol (Nombre, Descripcion) VALUES
        ('admin', 'Administrador del sistema'),
        ('empleado', 'Empleado de farmacia')`
    );
    console.log('<< Roles seeded: admin, empleado >>');
  }
}

async function seedAdmin() {
  // Check if admin user exists
  const [users] = await pool.query(`SELECT * FROM Usuario WHERE Usuario = 'admin'`);
  if (users.length === 0) {
    // find ID for 'Administrador' role
    const [roles] = await pool.query("SELECT ID FROM Rol WHERE Nombre = 'Administrador'");
    if (roles.length === 0) {
      console.warn('No admin role found; skipping admin user seed');
      return;
    }
    const adminRoleId = roles[0].ID;
    // create a personal entry for admin
    const [p] = await pool.query(
      `INSERT INTO Personal (CI, Nombre, Sexo, Telefono, Correo, Domicilio) VALUES (?, ?, ?, ?, ?, ?)`,
      ['000', 'Administrador', 'M', '', '', '']
    );
    const personalId = p.insertId;
    const hash = await bcrypt.hash('admin', 10);
    await pool.query(
      `INSERT INTO Usuario (Usuario, Contraseña, PersonalID, RolID) VALUES (?, ?, ?, ?)`,
      ['admin', hash, personalId, adminRoleId]
    );
    console.log('<< Admin user seeded: admin/admin >>');
  }
}

module.exports = { seedRoles, seedAdmin };