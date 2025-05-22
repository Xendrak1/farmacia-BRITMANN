// src/controllers/authController.js
const authService = require('../services/authService');
const { logAction } = require('../models/bitacoraModel');
const userModel = require('../models/userModel');
const personalModel = require('../models/personalModel');
const { pool } = require('../config/db');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await authService.authenticate(username, password);
    const token = authService.generateToken(user);
    await logAction(user.id, 'Login');
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await logAction(req.user.id, 'Logout');
    res.json({ message: 'Logout successful' });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               sexo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               domicilio:
 *                 type: string
 *               correoElectronico:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               confirmarContrasena:
 *                 type: string
 *               terms:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado
 */
async function register(req, res, next) {
  console.log('AuthController.register() called with body:', req.body);
  try {
    const {
      nombreCompleto,
      sexo,
      telefono,
      domicilio,
      correoElectronico,
      contrasena,
      confirmarContrasena,
      terms
    } = req.body;
    console.log('Parsed register data:', { nombreCompleto, sexo, telefono, domicilio, correoElectronico, terms });
    // validar contra
    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ message: 'Las contraseñas no coinciden' });
    }
    if (!terms) {
      return res.status(400).json({ message: 'Debe aceptar los términos' });
    }
    // crear registro en Personal
    const personalData = {
      CI: '',
      Nombre: nombreCompleto,
      Sexo: sexo,
      Telefono: telefono,
      Correo: correoElectronico,
      Domicilio: domicilio
    };
    console.log('Creating Personal with:', personalData);
    const personal = await personalModel.createPersonal(personalData);
    console.log('Personal created:', personal);
    // obtener un role default (primer role distinto a Admin)
    const [[defaultRole]] = await pool.query("SELECT ID FROM Rol WHERE Nombre != 'Administrador' ORDER BY ID LIMIT 1");
    const defaultRoleId = defaultRole ? defaultRole.ID : null;
    if (!defaultRoleId) throw new Error('No se encontró rol por defecto');
    const newUser = await userModel.createUser({
      username: correoElectronico,
      password: contrasena,
      personalId: personal.ID,
      role: defaultRoleId
    });
    console.log('User created:', newUser);
    await logAction(newUser.id, 'Register');
    res.status(201).json(newUser);
  } catch (err) {
    console.log('Error in register handler:', err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'Dato inválido' });
    }
    next(err);
  }
}

module.exports = { login, logout, register };