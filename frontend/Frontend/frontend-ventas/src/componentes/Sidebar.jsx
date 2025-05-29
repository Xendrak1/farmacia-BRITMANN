import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('');
  // Obtener el usuario desde localStorage
  let username = 'Usuario';
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.username) username = user.username;
  } catch {}
  return (
    <>
      <div
        className={`sidebar-overlay${isOpen ? ' sidebar-overlay-open' : ''}`}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(30,41,59,0.10)',
          zIndex: 1001,
          transition: 'opacity 0.2s',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          backdropFilter: 'blur(2px)',
        }}
      ></div>
      <aside
        className={`sidebar${isOpen ? ' sidebar-open' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 70%, #e0e7ff 100%)',
          boxShadow: '2px 0 16px 0 rgba(30,41,59,0.10)',
          borderTopRightRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
          minWidth: 270,
          maxWidth: 320,
          transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        }}
      >
        <div
          className="brand-section"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            padding: '2rem 1.5rem 1rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
         <img
  src="/Fotos/logo.jpg"
  alt="Farmacia Britmann"
  className="brand-logo"
  style={{ width: 44, height: 44, borderRadius: '1rem', boxShadow: '0 2px 8px #c7d2fe' }}
/>
          <span
            className="brand-title"
            style={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#2563eb',
              letterSpacing: '0.02em',
            }}
          >
            Farmacia Britmann
          </span>
        </div>
        <div
          className="user-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <i
            className="fa fa-user-circle"
            style={{
              fontSize: '2.2rem',
              color: '#2563eb',
              borderRadius: '50%',
              background: '#e0e7ff',
              padding: '0.2rem',
            }}
          ></i>
          <span
            className="user-name"
            style={{
              fontWeight: 600,
              fontSize: '1.08rem',
              color: '#334155',
            }}
          >
            {username}
          </span>
        </div>
        <nav className="sidebar-nav" style={{ paddingTop: '1.2rem' }}>
          <ul
            style={{
              padding: 0,
              margin: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <li className="sidebar-group">
              <div
                className={`sidebar-link sidebar-inventario${
                  location.pathname === '/inventario' ? ' sidebar-link-active' : ''
                }`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  cursor: 'pointer',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/inventario' ? '#fff' : '#2563eb',
                  background:
                    location.pathname === '/inventario'
                      ? 'rgba(37,99,235,0.08)'
                      : 'transparent',
                  boxShadow:
                    location.pathname === '/inventario' ? '0 2px 8px #c7d2fe' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }}
                onClick={() => {
                  navigate('/inventario');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(37,99,235,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/inventario' ? 'rgba(37,99,235,0.08)' : 'transparent')}
              >
                <i className="fa fa-warehouse" style={{ color: location.pathname === '/inventario' ? '#fff' : '#2563eb', fontSize: '1.25rem' }}></i>
                Inventario
              </div>
            </li>
            {/* Ventas/Facturación */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link ventas${location.pathname === '/ventas' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  cursor: 'pointer',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/ventas' ? '#fff' : '#22c55e',
                  background: location.pathname === '/ventas' ? '#16a34a' : 'transparent',
                  boxShadow: location.pathname === '/ventas' ? '0 2px 12px #bbf7d0' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => {
                  navigate('/ventas');
                  onClose && onClose();
                }}
                onMouseEnter={e => {
                  if (location.pathname === '/ventas') {
                    e.currentTarget.style.background = '#16a34a';
                  } else {
                    e.currentTarget.style.background = 'rgba(34,197,94,0.13)';
                  }
                }}
                onMouseLeave={e => {
                  if (location.pathname === '/ventas') {
                    e.currentTarget.style.background = '#16a34a';
                  } else {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <i
                  className="fa fa-file-invoice-dollar"
                  style={{ color: location.pathname === '/ventas' ? '#fff' : '#22c55e', fontSize: '1.25rem' }}
                ></i>
                Ventas/Facturación
              </div>
            </li>
            {/* Compras */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link compras${location.pathname === '/compras' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/compras' ? '#fff' : '#f59e42',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: location.pathname === '/compras' ? 'rgba(245,158,66,0.10)' : 'transparent',
                  boxShadow: location.pathname === '/compras' ? '0 2px 8px #fde68a' : 'none',
                }}
                onClick={() => {
                  navigate('/compras');
                  onClose && onClose();
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    'rgba(245,158,66,0.10)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = location.pathname === '/compras' ? 'rgba(245,158,66,0.10)' : 'transparent')
                }
              >
                <i
                  className="fa fa-shopping-basket"
                  style={{ color: location.pathname === '/compras' ? '#fff' : '#f59e42', fontSize: '1.25rem' }}
                ></i>
                Compras
              </div>
            </li>
            {/* Clientes */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link${location.pathname === '/clientes/gestionar' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/clientes/gestionar' ? '#fff' : '#0ea5e9',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: location.pathname === '/clientes/gestionar' ? '#0ea5e9' : 'transparent',
                  boxShadow: location.pathname === '/clientes/gestionar' ? '0 2px 8px #bae6fd' : 'none',
                }}
                onClick={() => {
                  navigate('/clientes/gestionar');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(14,165,233,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/clientes/gestionar' ? '#0ea5e9' : 'transparent')}
              >
                <i
                  className="fa fa-user-friends"
                  style={{ color: location.pathname === '/clientes/gestionar' ? '#fff' : '#0ea5e9', fontSize: '1.25rem' }}
                ></i>
                Clientes
              </div>
            </li>
            {/* Administración (sin submenu) */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link admin${location.pathname === '/administracion/gestionar-usuarios' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/administracion/gestionar-usuarios' ? '#fff' : '#a21caf',
                  cursor: 'pointer',
                  background: location.pathname === '/administracion/gestionar-usuarios' ? '#a21caf' : 'transparent',
                  boxShadow: location.pathname === '/administracion/gestionar-usuarios' ? '0 2px 12px #e9d5ff' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => {
                  navigate('/administracion/gestionar-usuarios');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(162,28,175,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/administracion/gestionar-usuarios' ? '#a21caf' : 'transparent')}
              >
                <i className="fa fa-cogs" style={{ color: location.pathname === '/administracion/gestionar-usuarios' ? '#fff' : '#a21caf', fontSize: '1.25rem' }}></i>
                Administración
              </div>
            </li>
            {/* Reportes y Bitácora */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link reportes${location.pathname === '/bitacora' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/bitacora' ? '#fff' : '#e11d48',
                  cursor: 'pointer',
                  background: location.pathname === '/bitacora' ? '#be123c' : 'transparent',
                  boxShadow: location.pathname === '/bitacora' ? '0 2px 12px #fecaca' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => {
                  navigate('/bitacora');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(190,18,60,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/bitacora' ? '#be123c' : 'transparent')}
              >
                <i
                  className="fa fa-chart-line"
                  style={{ color: location.pathname === '/bitacora' ? '#fff' : '#e11d48', fontSize: '1.25rem' }}
                ></i>
                Reportes y Bitácora
              </div>
            </li>
            {/* Recetas Médicas */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link${location.pathname === '/recetas/validar' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/recetas/validar' ? '#fff' : '#0d9488',
                  cursor: 'pointer',
                  background: location.pathname === '/recetas/validar' ? '#0f766e' : 'transparent',
                  boxShadow: location.pathname === '/recetas/validar' ? '0 2px 12px #99f6e4' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => {
                  navigate('/recetas/validar');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(15,118,110,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/recetas/validar' ? '#0f766e' : 'transparent')}
              >
                <i
                  className="fa fa-file-medical"
                  style={{ color: location.pathname === '/recetas/validar' ? '#fff' : '#0d9488', fontSize: '1.25rem' }}
                ></i>
                Recetas Médicas
              </div>
            </li>
            {/* Categorías y Productos (sin submenu) */}
            <li className="sidebar-group">
              <div
                className={`sidebar-link categorias${location.pathname === '/inventario/gestionar-productos' ? ' sidebar-link-active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '0.85rem 1.7rem',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.08rem',
                  color: location.pathname === '/inventario/gestionar-productos' ? '#fff' : '#fbbf24',
                  cursor: 'pointer',
                  background: location.pathname === '/inventario/gestionar-productos' ? '#ca8a04' : 'transparent',
                  boxShadow: location.pathname === '/inventario/gestionar-productos' ? '0 2px 12px #fde68a' : 'none',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => {
                  navigate('/inventario/gestionar-productos');
                  onClose && onClose();
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(202,138,4,0.13)')}
                onMouseLeave={e => (e.currentTarget.style.background = location.pathname === '/inventario/gestionar-productos' ? '#ca8a04' : 'transparent')}
              >
                <i className="fa fa-boxes" style={{ color: location.pathname === '/inventario/gestionar-productos' ? '#fff' : '#fbbf24', fontSize: '1.25rem' }}></i>
                Categorías y Productos
              </div>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
