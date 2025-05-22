// src/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const personalRoutes = require('./routes/personal');
const clienteRoutes = require('./routes/cliente');
const facturaRoutes = require('./routes/factura');
const roleRoutes = require('./routes/role');
const userRoutes = require('./routes/user');
const privilegioRoutes = require('./routes/privilegio');
const permisoRoutes = require('./routes/permiso');
const marcaRoutes = require('./routes/marca');
const categoriaRoutes = require('./routes/categoria');
const swaggerOptions = require('./utils/swagger');
const fs = require('fs');

const app = express();

// Debug: log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend static files from the 'farmacia-main' directory
app.use(express.static(path.join(__dirname, '../../farmacia-main')));

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/privilegios', privilegioRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/categorias', categoriaRoutes);

// SPA fallback: serve index.html for any non-API GET request from 'farmacia-main'
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && req.method === 'GET') {
    const indexPath = path.join(__dirname, '../../farmacia-main/index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    } else {
      return res.status(404).json({ message: 'index.html no encontrado en farmacia-main' });
    }
  }
  next();
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  // Solo loggear errores de servidor (status >= 500) o sin status definido
  if (!err.status || err.status >= 500) console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;