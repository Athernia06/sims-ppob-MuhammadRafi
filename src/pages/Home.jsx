// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState([]);
  const [banners, setBanners] = useState([]);
  const [showBalance, setShowBalance] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [profileRes, balanceRes, servicesRes, bannersRes] = await Promise.all([
          api.get('/profile'),
          api.get('/balance'),
          api.get('/services'),
          api.get('/banner')
        ]);

        setProfile(profileRes.data.data);
        setBalance(balanceRes.data.data.balance);
        setServices(servicesRes.data.data);
        setBanners(bannersRes.data.data);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: '#333', paddingBottom: '50px' }}>
      <Navbar />
      
      <div style={{ padding: '30px 50px', fontFamily: 'sans-serif' }}>
        {/* Section 1: Profile & Balance Hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
          {/* Bagian Kiri: Profile Info */}
          <div style={{ flex: 1 }}>
            <img 
              src={profile?.profile_image && profile.profile_image !== "https://null" ? profile.profile_image : "https://via.placeholder.com/80"} 
              alt="Profile" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px' }}
            />
            <p style={{ fontSize: '18px', margin: '0 0 5px 0', color: '#555' }}>Selamat datang,</p>
            <h2 style={{ margin: '0', fontSize: '32px' }}>
              {isLoading ? 'Loading...' : `${profile?.first_name} ${profile?.last_name}`}
            </h2>
          </div>

          {/* Bagian Kanan: Card Saldo */}
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

        {/* Section 2: Menu Layanan (Services) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', marginBottom: '40px' }}>
          {services.map((service, index) => (
            <div 
              key={index} 
              onClick={() => navigate('/payment', { state: { service } })} 
              style={{ textAlign: 'center', width: '80px', cursor: 'pointer' }}
            >
              <img 
                src={service.service_icon} 
                alt={service.service_name} 
                style={{ width: '60px', height: '60px', marginBottom: '10px' }}
              />
              <p style={{ margin: 0, fontSize: '12px', wordWrap: 'break-word' }}>{service.service_name}</p>
            </div>
          ))}
        </div>

        {/* Section 3: Banner Promo */}
        <div>
          <h4 style={{ marginBottom: '20px' }}>Temukan promo menarik</h4>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px' }}>
            {banners.map((banner, index) => (
              <img 
                key={index}
                src={banner.banner_image} 
                alt={banner.banner_name} 
                style={{ width: '280px', height: '120px', borderRadius: '15px', objectFit: 'cover', flexShrink: 0 }}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;