// src/config/db.js
require('dotenv').config();
const mysql = require('mysql2');
// Create a callback-based pool and wrap it with promise API
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
}).promise();

// Export promise-based pool
module.exports = { pool };
