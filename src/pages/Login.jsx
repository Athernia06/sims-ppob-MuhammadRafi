// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../redux/authSlice';
import loginIllustration from '../assets/login-illustration.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Format email tidak valid');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password minimal 8 karakter');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/login', { email, password });
      const token = response.data.data.token; 
      dispatch(loginSuccess(token));
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Login gagal.');
      } else {
        setErrorMsg('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#f13b2f', borderRadius: '50%' }}></div>
            <h2 style={{ margin: 0 }}>SIMS PPOB</h2>
          </div>

          <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '40px' }}>
            Masuk atau buat akun untuk memulai
          </h3>
          
          {errorMsg && (
            <div style={{ color: 'red', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="masukkan email anda"
                style={{ width: '100%', padding: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="masukkan password anda"
                style={{ width: '100%', padding: '15px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                padding: '15px', 
                cursor: isLoading ? 'not-allowed' : 'pointer', 
                backgroundColor: '#f13b2f', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '16px',
                marginTop: '10px'
              }}
            >
              {isLoading ? 'Loading...' : 'Masuk'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>
            belum punya akun? <Link to="/registration" style={{ color: '#f13b2f', fontWeight: 'bold', textDecoration: 'none' }}>registrasi di sini</Link>
          </p>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src={loginIllustration} 
          alt="Login Illustration" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

    </div>
  );
};

export default Login;