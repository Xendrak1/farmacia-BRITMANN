import React, { useEffect, useState } from 'react';
import '../componentes/Bitacora.css';
import api from '../api';

const BitacoraPage = () => {
  const [logs, setLogs] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [filtros, setFiltros] = useState({ usuario: '', accion: '', fecha: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBitacora() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/bitacora');
        setLogs(res.data);
        // Extraer usuarios únicos de los logs
        const usuariosUnicos = Array.from(new Set(res.data.map(l => l.UsuarioID))).map(id => {
          const log = res.data.find(l => l.UsuarioID === id);
          return { id, nombre: log?.nombre || `Usuario ${id}` };
        });
        setUsuarios(usuariosUnicos);
      } catch (err) {
        setError('Error al cargar la bitácora');
      } finally {
        setLoading(false);
      }
    }
    fetchBitacora();
  }, []);

  // Filtros
  const logsFiltrados = logs.filter(log => {
    const usuarioOk = !filtros.usuario || String(log.UsuarioID) === filtros.usuario;
    const accionOk = !filtros.accion || (log.Accion || '').toLowerCase().includes(filtros.accion.toLowerCase());
    const fechaOk = !filtros.fecha || log.Fecha === filtros.fecha;
    return usuarioOk && accionOk && fechaOk;
  });

  // Estadísticas
  const accionesHoy = logs.filter(log => log.Fecha === new Date().toISOString().slice(0, 10)).length;
  const usuariosActivos = [...new Set(logs.map(log => log.UsuarioID))].length;
  const intentosFallidos = logs.filter(log => (log.Accion || '').toLowerCase().includes('fallido')).length;
  const erroresSistema = logs.filter(log => (log.Accion || '').toLowerCase().includes('error')).length;

  return (
    <div className="bitacora-modern-container">
      <div className="header">
        <h1>🔍 Bitácora</h1>
        <div className="date-time">{new Date().toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-number">{accionesHoy}</div>
          <div className="stat-label">Acciones Hoy</div>
        </div>
        <div className="stat-card green">
          <div className="stat-number">{usuariosActivos}</div>
          <div className="stat-label">Usuarios Activos</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-number">{intentosFallidos}</div>
          <div className="stat-label">Intentos Fallidos</div>
        </div>
        <div className="stat-card red">
          <div className="stat-number">{erroresSistema}</div>
          <div className="stat-label">Errores de Sistema</div>
        </div>
      </div>
      <div className="main-content" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
        <div className="bitacora-section">
          <div className="section-header">
            <span>Registro de Actividades del Sistema</span>
            <span style={{ fontSize: 14, fontWeight: 'normal' }}>⚡ Tiempo real</span>
          </div>
          <div className="filters-container">
            <div className="filters-row">
              <div className="filter-group">
                <label>Usuario</label>
                <select value={filtros.usuario} onChange={e => setFiltros({ ...filtros, usuario: e.target.value })}>
                  <option value="">Todos los usuarios</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Acción</label>
                <input type="text" placeholder="Buscar acción..." value={filtros.accion} onChange={e => setFiltros({ ...filtros, accion: e.target.value })} />
              </div>
              <div className="filter-group">
                <label>Fecha</label>
                <input type="date" value={filtros.fecha} onChange={e => setFiltros({ ...filtros, fecha: e.target.value })} />
              </div>
              <button className="btn-filter" onClick={() => {}}>Filtrar</button>
            </div>
          </div>
          <div className="log-container">
            {loading ? (
              <div className="bitacora-loading">Cargando...</div>
            ) : error ? (
              <div className="bitacora-error">{error}</div>
            ) : logsFiltrados.length === 0 ? (
              <div className="bitacora-error">No hay registros para los filtros seleccionados.</div>
            ) : (
              logsFiltrados.map((log, idx) => (
                <div className="log-entry" key={log.ID}>
                  <div className="log-status success"></div>
                  <div className="log-details">
                    <div className="log-action">{log.Accion}</div>
                    <div className="log-user">👤 {log.nombre || log.UsuarioID}</div>
                    <div className="log-description">ID: {log.ID}</div>
                  </div>
                  <div className="log-timestamp">{log.Fecha} {log.Hora}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitacoraPage;
