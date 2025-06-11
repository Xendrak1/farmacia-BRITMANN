const { getAllBitacora, logAction } = require('../models/bitacoraModel');

async function getBitacora(req, res) {
  try {
    console.log('🔍 [BITÁCORA CONTROLLER] Petición recibida (sin autenticación requerida)');
    const bitacora = await getAllBitacora();
    console.log('📊 [BITÁCORA CONTROLLER] Total registros encontrados:', bitacora.length);
    console.log('📅 [BITÁCORA CONTROLLER] Últimos 3 registros:', bitacora.slice(0, 3));
    console.log('👥 [BITÁCORA CONTROLLER] Usuarios únicos en la bitácora:', [...new Set(bitacora.map(b => b.UsuarioID))]);
    
    res.json(bitacora);
  } catch (err) {
    console.error('❌ [BITÁCORA CONTROLLER] Error:', err);
    res.status(500).json({ message: 'Error al obtener bitácora', error: err.message });
  }
}

module.exports = { getBitacora }; 