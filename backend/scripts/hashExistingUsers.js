// scripts/hashExistingUsers.js
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

(async () => {
  try {
    const [users] = await pool.query(
      "SELECT ID, contrasena FROM usuario WHERE contrasena NOT LIKE '$2b$%'"
    );
    for (const u of users) {
      const hash = await bcrypt.hash(u.contrasena, 10);
      await pool.query('UPDATE usuario SET contrasena = ? WHERE ID = ?', [hash, u.ID]);
      console.log(`Usuario ${u.ID} actualizado`);
    }
    console.log('<< Hashing completo >>');
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
})(); 