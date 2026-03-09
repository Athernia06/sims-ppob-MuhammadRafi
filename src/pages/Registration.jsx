// src/pages/Registration.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import loginIllustration from '../assets/login-illustration.png'; 

const Registration = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // Validasi Input
    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      setIsError(true);
      setMessage('Semua field wajib diisi');
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Password dan Konfirmasi Password tidak cocok');
      return;
    }

    if (password.length < 8) {
      setIsError(true);
      setMessage('Password minimal 8 karakter');
      return;
    }

    // Hit API Registration
    try {
      setIsLoading(true);
      const response = await api.post('/registration', {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      setIsError(false);
      setMessage(response.data.message || 'Registrasi berhasil! Silakan login.');
      
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Registrasi gagal.');
      } else {
        setMessage('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Bagian Kiri: Form Registrasi */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#f13b2f', borderRadius: '50%' }}></div>
            <h2 style={{ margin: 0 }}>SIMS PPOB</h2>
          </div>

          <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '30px' }}>
            Lengkapi data untuk membuat akun
          </h3>
          
          {message && (
            <div style={{ color: isError ? 'red' : 'green', backgroundColor: isError ? '#fee2e2' : '#dcfce3', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="@ masukkan email anda"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="👤 nama depan"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="👤 nama belakang"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="🔒 buat password"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="🔒 konfirmasi password"
                style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ 
                padding: '12px', 
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
              {isLoading ? 'Loading...' : 'Registrasi'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#888' }}>
            sudah punya akun? <Link to="/login" style={{ color: '#f13b2f', fontWeight: 'bold', textDecoration: 'none' }}>login di sini</Link>
          </p>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img 
          src={loginIllustration} 
          alt="Registration Illustration" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

    </div>
  );
};

export default Registration;