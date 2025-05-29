// src/utils/swagger.js
require('dotenv').config();

module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Farmacia BRITMANN API',
      version: '1.0.0',
      description: 'API para gestionar autenticación del ciclo 1'
    },
    servers: [
      { url: `http://localhost:${process.env.PORT}` }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      { bearerAuth: [] }
    ]
  },
  apis: ['./src/routes/*.js']
};