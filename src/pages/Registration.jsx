// src/pages/Registration.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

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

    // 1. Validasi Input
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

    // 2. Hit API Registration
    try {
      setIsLoading(true);
      const response = await api.post('/registration', {
        email,
        first_name: firstName,
        last_name: lastName,
        password,
      });

      // 3. Handling response sukses
      setIsError(false);
      setMessage(response.data.message || 'Registrasi berhasil! Silakan login.');
      
      // Kosongkan form setelah sukses
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
      setConfirmPassword('');

      // Opsional: Arahkan ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      // 4. Handling response error dari API
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Registrasi SIMS PPOB</h2>
      
      {/* Notifikasi Sukses/Error */}
      {message && (
        <div style={{ 
          color: isError ? 'red' : 'green', 
          backgroundColor: isError ? '#fee2e2' : '#dcfce3', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '15px', 
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="masukkan email anda"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <input 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            placeholder="nama depan"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <input 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            placeholder="nama belakang"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="buat password"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="konfirmasi password"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
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
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Loading...' : 'Registrasi'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
        Sudah punya akun? <Link to="/login" style={{ color: '#f13b2f', fontWeight: 'bold', textDecoration: 'none' }}>login di sini</Link>
      </p>
    </div>
  );
};

export default Registration;