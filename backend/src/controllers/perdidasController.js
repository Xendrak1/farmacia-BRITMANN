const perdidasModel = require('../models/perdidasModel');
const { logAction } = require('../models/bitacoraModel');

exports.getAllPerdidas = async (req, res) => {
  try {
    const perdidas = await perdidasModel.getAllPerdidas();
    res.json(perdidas);
  } catch (err) {
    console.error('Error obteniendo pérdidas:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPerdidaById = async (req, res) => {
  try {
    const perdida = await perdidasModel.getPerdidaById(req.params.id);
    if (!perdida) return res.status(404).json({ error: 'Pérdida no encontrada' });
    res.json(perdida);
  } catch (err) {
    console.error('Error obteniendo pérdida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createPerdida = async (req, res) => {
  try {
    console.log('Creando pérdida:', req.body);
    
    // Validar datos requeridos
    const { ProductoID, Cantidad, TipoPerdida, Fecha, Hora, ValorUnitario } = req.body;
    
    if (!ProductoID || !Cantidad || !TipoPerdida || !Fecha || !Hora || !ValorUnitario) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Agregar UsuarioID si está disponible
    if (req.user && req.user.id) {
      req.body.UsuarioID = req.user.id;
    }

    const id = await perdidasModel.createPerdida(req.body);
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Pérdida registrada: ${TipoPerdida} - Producto ID: ${ProductoID}`);
    }
    
    res.status(201).json({ message: 'Pérdida registrada exitosamente', id });
  } catch (err) {
    console.error('Error creando pérdida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updatePerdida = async (req, res) => {
  try {
    console.log('Actualizando pérdida:', req.params.id, req.body);
    
    await perdidasModel.updatePerdida(req.params.id, req.body);
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Pérdida actualizada: ID ${req.params.id}`);
    }
    
    res.json({ message: 'Pérdida actualizada exitosamente' });
  } catch (err) {
    console.error('Error actualizando pérdida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deletePerdida = async (req, res) => {
  try {
    console.log('Eliminando pérdida:', req.params.id);
    
    await perdidasModel.deletePerdida(req.params.id);
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Pérdida eliminada: ID ${req.params.id}`);
    }
    
    res.json({ message: 'Pérdida eliminada exitosamente' });
  } catch (err) {
    console.error('Error eliminando pérdida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getPerdidasByTipo = async (req, res) => {
  try {
    const perdidas = await perdidasModel.getPerdidasByTipo(req.params.tipo);
    res.json(perdidas);
  } catch (err) {
    console.error('Error obteniendo pérdidas por tipo:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getEstadisticasPerdidas = async (req, res) => {
  try {
    const estadisticas = await perdidasModel.getEstadisticasPerdidas();
    res.json(estadisticas);
  } catch (err) {
    console.error('Error obteniendo estadísticas:', err);
    res.status(500).json({ error: err.message });
  }
}; 