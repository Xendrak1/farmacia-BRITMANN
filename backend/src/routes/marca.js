const express = require('express');
const router = express.Router();
const { getMarcas } = require('../controllers/marcaController');

router.get('/', getMarcas);

module.exports = router; 