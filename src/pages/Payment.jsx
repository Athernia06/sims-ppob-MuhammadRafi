// src/pages/Payment.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mengambil data service yang dikirim dari halaman Home
  const service = location.state?.service;

  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Jika user mengakses URL ini langsung tanpa klik dari Home, kembalikan ke Home
    if (!service) {
      navigate('/');
      return;
    }
    fetchBalance();
  }, [service, navigate]);

  const fetchBalance = async () => {
    try {
      const res = await api.get('/balance');
      setBalance(res.data.data.balance);
    } catch (error) {
      console.error("Gagal mengambil saldo", error);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    // Cek apakah saldo cukup sebelum hit API (Best practice)
    if (balance < service.service_tariff) {
      setIsError(true);
      setMessage('Saldo tidak mencukupi untuk melakukan pembayaran ini.');
      return;
    }

    try {
      setIsLoading(true);
      // Hit API Transaksi
      const response = await api.post('/transaction', {
        service_code: service.service_code,
      });

      setIsError(false);
      setMessage(response.data.message || `Pembayaran ${service.service_name} berhasil!`);
      fetchBalance(); // Update saldo setelah bayar
      
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

  if (!service) return null; // Mencegah render error jika service kosong

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: '#333' }}>
      <Navbar />
      
      <div style={{ padding: '30px 50px', fontFamily: 'sans-serif' }}>
        
        {/* Header: Info Saldo */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '18px', margin: '0 0 5px 0' }}>Saldo Anda Saat Ini</p>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '32px' }}>
            Rp {balance.toLocaleString('id-ID')}
          </h2>
        </div>

        {/* Info Layanan yang akan dibayar */}
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
              width: '100%', 
              padding: '15px', 
              borderRadius: '5px', 
              border: '1px solid #ccc', 
              fontSize: '16px',
              backgroundColor: '#f9f9f9',
              color: '#555',
              boxSizing: 'border-box'
            }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '15px', 
              backgroundColor: isLoading ? '#ccc' : '#f13b2f', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {isLoading ? 'Memproses...' : 'Bayar'}
          </button>
        </form>

        {/* Notifikasi */}
        {message && (
          <div style={{ 
            marginTop: '15px',
            maxWidth: '600px',
            color: isError ? 'red' : 'green', 
            backgroundColor: isError ? '#fee2e2' : '#dcfce3', 
            padding: '10px', 
            borderRadius: '5px', 
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default Payment;