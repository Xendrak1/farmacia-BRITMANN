const notaSalidaModel = require('../models/notaSalidaModel');
const { logAction } = require('../models/bitacoraModel');

exports.getAllNotasSalida = async (req, res) => {
  try {
    const notas = await notaSalidaModel.getAllNotasSalida();
    res.json(notas);
  } catch (err) {
    console.error('Error obteniendo notas de salida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNotaSalidaById = async (req, res) => {
  try {
    const nota = await notaSalidaModel.getNotaSalidaById(req.params.id);
    if (!nota) return res.status(404).json({ error: 'Nota de salida no encontrada' });
    res.json(nota);
  } catch (err) {
    console.error('Error obteniendo nota de salida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getDetallesNotaSalida = async (req, res) => {
  try {
    const detalles = await notaSalidaModel.getDetallesNotaSalida(req.params.id);
    res.json(detalles);
  } catch (err) {
    console.error('Error obteniendo detalles:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createNotaSalida = async (req, res) => {
  try {
    console.log('Creando nota de salida:', req.body.Motivo || 'sin motivo');
    
    // Agregar UsuarioID si está disponible
    if (req.user && req.user.id) {
      req.body.UsuarioID = req.user.id;
    }
    
    const id = await notaSalidaModel.createNotaSalida(req.body);
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Nota de salida registrada: ${req.body.Motivo} - ID: ${id}`);
    }
    
    res.status(201).json({ message: 'Nota de salida registrada', id });
  } catch (err) {
    console.error('Error creando nota de salida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateNotaSalida = async (req, res) => {
  try {
    console.log('Actualizando nota de salida:', req.params.id, req.body);
    
    // Agregar UsuarioID si está disponible
    if (req.user && req.user.id) {
      req.body.UsuarioID = req.user.id;
    }
    
    const success = await notaSalidaModel.updateNotaSalida(req.params.id, req.body);
    
    if (!success) {
      return res.status(404).json({ error: 'Nota de salida no encontrada' });
    }
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Nota de salida actualizada: ID ${req.params.id}`);
    }
    
    res.json({ message: 'Nota de salida actualizada exitosamente' });
  } catch (err) {
    console.error('Error actualizando nota de salida:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNotaSalida = async (req, res) => {
  try {
    console.log('Eliminando nota de salida:', req.params.id);
    
    const success = await notaSalidaModel.deleteNotaSalida(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Nota de salida no encontrada' });
    }
    
    if (req.user && req.user.id) {
      await logAction(req.user.id, `Nota de salida eliminada: ID ${req.params.id}`);
    }
    
    res.json({ message: 'Nota de salida eliminada exitosamente' });
  } catch (err) {
    console.error('Error eliminando nota de salida:', err);
    res.status(500).json({ error: err.message });
  }
}; 