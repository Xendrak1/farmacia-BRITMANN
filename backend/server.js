// server.js
require('dotenv').config();
const app = require('./src/app');
const { seedRoles, seedAdmin } = require('./src/utils/seed');

// Seed initial data (roles)
seedRoles().catch(err => console.error('Error seeding roles:', err));

// Seed default admin user
seedAdmin().catch(err => console.error('Error seeding admin user:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});