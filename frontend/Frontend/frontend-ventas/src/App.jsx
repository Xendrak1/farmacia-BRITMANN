import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import RegistroDeUsuario from './pages/RegistroDeUsuario';
import OlvideContrasena from './pages/OlvideContrasena';
import RutaPrivada from './componentes/RutaPrivada';
import './App.css';

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/registro-usuario" element={<RegistroDeUsuario />} />
    <Route path="/olvide-contrasena" element={<OlvideContrasena />} />
    <Route path="/*" element={
      <RutaPrivada>
        <MainLayout />
      </RutaPrivada>
    } />
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default App;