// src/pages/TopUp.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const TopUp = () => {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

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

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
    setMessage(''); 
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    const numericAmount = parseInt(amount, 10);

    if (!numericAmount || numericAmount < 10000) {
      setIsError(true);
      setMessage('Minimal Top Up adalah Rp 10.000');
      return;
    }
    if (numericAmount > 1000000) {
      setIsError(true);
      setMessage('Maksimal Top Up adalah Rp 1.000.000');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/topup', {
        top_up_amount: numericAmount,
      });

      setIsError(false);
      setMessage(response.data.message || 'Top Up Berhasil!');
      setAmount(''); 
      
      const balanceRes = await api.get('/balance');
      setBalance(balanceRes.data.data.balance);
      
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || 'Top Up gagal.');
      } else {
        setMessage('Terjadi kesalahan pada server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !amount || parseInt(amount, 10) < 10000 || isLoading;

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: '#333' }}>
      <Navbar />
      
      <div style={{ padding: '30px 50px', fontFamily: 'sans-serif' }}>
        
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
            flex: 1.5, 
            backgroundColor: '#f13b2f', 
            color: 'white', 
            padding: '25px 30px', 
            borderRadius: '20px',
            boxShadow: '0 4px 10px rgba(241, 59, 47, 0.3)'
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

        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '18px', margin: '0 0 5px 0' }}>Silakan masukkan</p>
          <h2 style={{ margin: '0', fontSize: '32px' }}>Nominal Top Up</h2>
        </div>

        <div style={{ display: 'flex', gap: '30px' }}>
          
          <div style={{ flex: 1.5 }}>
            <form onSubmit={handleTopUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input 
                type="text" 
                value={amount}
                onChange={handleAmountChange}
                placeholder="masukkan nominal Top Up"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: '5px', 
                  border: '1px solid #ccc', 
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
              />
              
              <button 
                type="submit" 
                disabled={isSubmitDisabled}
                style={{ 
                  padding: '15px', 
                  backgroundColor: isSubmitDisabled ? '#ccc' : '#f13b2f', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {isLoading ? 'Memproses...' : 'Top Up'}
              </button>
            </form>

            {/* Notifikasi */}
            {message && (
              <div style={{ 
                marginTop: '15px',
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

          <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '10px', alignContent: 'flex-start' }}>
            {quickAmounts.map((val, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setAmount(val.toString());
                  setMessage('');
                }}
                style={{
                  flex: '1 0 30%',
                  padding: '15px 5px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#555'
                }}
              >
                Rp {val.toLocaleString('id-ID')}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopUp;