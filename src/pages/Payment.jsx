// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state?.service;

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!service) {
      navigate('/');
      return;
    }
    fetchData();
  }, [service, navigate]);

  const fetchData = async () => {
    try {
      const [profileRes, balanceRes] = await Promise.all([
        api.get('/profile'),
        api.get('/balance')
      ]);
      setProfile(profileRes.data.data);
      setBalance(balanceRes.data.data.balance);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (balance < service.service_tariff) {
      setIsError(true);
      setMessage('Saldo tidak mencukupi untuk melakukan pembayaran ini.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/transaction', {
        service_code: service.service_code,
      });

      setIsError(false);
      setMessage(response.data.message || `Pembayaran ${service.service_name} berhasil!`);
      
      const balanceRes = await api.get('/balance');
      setBalance(balanceRes.data.data.balance);
      
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Pembayaran gagal.');
      } else {
        setMessage('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!service) return null;

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: '#333' }}>
      <Navbar />
      
      <div style={{ padding: '30px 50px', fontFamily: 'sans-serif' }}>
        
        {/* --- Header: Profile & Balance --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
          <div style={{ flex: 1 }}>
            <img 
              src={profile?.profile_image && profile.profile_image !== "https://null" ? profile.profile_image : "https://via.placeholder.com/80"} 
              alt="Profile" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }}
            />
            <p style={{ fontSize: '18px', margin: '0 0 5px 0', color: '#555' }}>Selamat datang,</p>
            <h2 style={{ margin: '0', fontSize: '32px' }}>
              {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
            </h2>
          </div>

          <div style={{ 
            flex: 1.5, backgroundColor: '#f13b2f', color: 'white', padding: '25px 30px', 
            borderRadius: '20px', boxShadow: '0 4px 10px rgba(241, 59, 47, 0.3)'
          }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Saldo anda</p>
            <h1 style={{ margin: '0 0 15px 0', fontSize: '36px' }}>
              Rp {showBalance ? balance.toLocaleString('id-ID') : '•••••••'}
            </h1>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, fontSize: '14px', fontWeight: 'bold' }}
            >
              {showBalance ? 'Tutup Saldo' : 'Lihat Saldo'}
            </button>
          </div>
        </div>
        {/* --- End Header --- */}

        {/* Info Layanan */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', margin: '0 0 10px 0' }}>Pembayaran</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <img src={service.service_icon} alt={service.service_name} style={{ width: '40px', height: '40px' }} />
            <h3 style={{ margin: 0 }}>{service.service_name}</h3>
          </div>
        </div>

        {/* Form Pembayaran */}
        <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
          <input 
            type="text" 
            value={`Rp ${service.service_tariff.toLocaleString('id-ID')}`}
            disabled
            style={{ 
              width: '100%', padding: '15px', borderRadius: '5px', border: '1px solid #ccc', 
              fontSize: '16px', backgroundColor: '#f9f9f9', color: '#555', boxSizing: 'border-box'
            }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '15px', backgroundColor: isLoading ? '#ccc' : '#f13b2f', color: 'white', 
              border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px'
            }}
          >
            {isLoading ? 'Memproses...' : 'Bayar'}
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '15px', maxWidth: '600px', color: isError ? 'red' : 'green', backgroundColor: isError ? '#fee2e2' : '#dcfce3', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default Payment;