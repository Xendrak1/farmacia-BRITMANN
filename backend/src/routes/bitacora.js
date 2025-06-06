const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getBitacora } = require('../controllers/bitacoraController');
const router = express.Router();

router.get('/', verifyToken, getBitacora);

module.exports = router; 