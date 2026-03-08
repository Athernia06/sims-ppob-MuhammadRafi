// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Mencegah reload halaman saat submit
    setErrorMsg('');

    // 1. Validasi Input (Syarat dari soal)
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

    // 2. Hit API Login
    try {
      setIsLoading(true);
      // Catatan: Pastikan endpoint '/login' sesuai dengan dokumentasi Swagger
      const response = await api.post('/login', {
        email,
        password,
      });

      // 3. Simpan Token ke Redux
      const token = response.data.data.token; 
      dispatch(loginSuccess(token));

      // 4. Arahkan ke halaman utama (Home) setelah sukses
      navigate('/');
    } catch (error) {
      // Handling response error dari API (Syarat dari soal)
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Login gagal, periksa kembali email dan password Anda.');
      } else {
        setErrorMsg('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Login SIMS PPOB</h2>
      
      {/* Notifikasi Error */}
      {errorMsg && (
        <div style={{ color: 'red', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px' }}>
          {errorMsg}
        </div>
      )}
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="masukkan email anda"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="masukkan password anda"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          style={{ 
            padding: '12px', 
            cursor: isLoading ? 'not-allowed' : 'pointer', 
            backgroundColor: '#f13b2f', // Warna merah khas PPOB pada mockup umumnya
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Loading...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
};

export default Login;