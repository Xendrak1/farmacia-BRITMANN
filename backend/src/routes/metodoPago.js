const express = require('express');
const router = express.Router();
const { getAllMetodosPago } = require('../controllers/metodoPagoController');

router.get('/', getAllMetodosPago);

module.exports = router; 