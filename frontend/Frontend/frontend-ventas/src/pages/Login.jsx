// Página de login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../componentes/Login.css';
import { login as loginAPI } from '../api';

const Login = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLeaving(true);
    setError('');
    try {
      const res = await loginAPI(user, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (err) {
      setIsLeaving(false);
      setError('Usuario o contraseña incorrectos');
    }
  };

  const handleCrearCuenta = (e) => {
    e.preventDefault();
    setIsLeaving(true);
    setTimeout(() => {
      navigate('/registro-usuario');
    }, 400);
  };

  return (
    <div className={`login-container${isLeaving ? ' login-leave' : ''}`}>
      <div className="login-illustration">
        <img src="https://cdn.pixabay.com/photo/2017/01/31/13/14/online-2023924_1280.png" alt="Farmacia Ilustración" />
      </div>
      <div className="login-form-section">
        <img className="login-logo" src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="logo" />
        <h1 className="login-title">FARMACIA<br/>BRITMANN</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}
          <label className="login-label">Usuario</label>
          <div className="login-input-group">
            <span className="login-icon"><i className="fa fa-user"></i></span>
            <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="" />
          </div>
          <label className="login-label">Contraseña</label>
          <div className="login-input-group">
            <span className="login-icon"><i className="fa fa-lock"></i></span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="" />
          </div>
          <div className="login-links-row">
            <a href="#" className="login-link" onClick={e => {e.preventDefault(); navigate('/olvide-contrasena')}}>Recuperar contraseña</a>
            <a href="#" className="login-link" onClick={handleCrearCuenta}>Crear cuenta</a>
          </div>
          <button className="login-btn" type="submit">INICIAR SESIÓN</button>
        </form>      
      </div>
    </div>
  );
};

export default Login;
