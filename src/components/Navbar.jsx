// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Fungsi kecil untuk mengecek apakah menu sedang aktif
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 50px', 
      borderBottom: '1px solid #eaeaea',
      fontFamily: 'sans-serif'
    }}>
      {/* Bagian Kiri: Logo & Nama Aplikasi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Nanti icon logo asli dari Google Drive bisa dipasang di sini */}
          <div style={{ width: '24px', height: '24px', backgroundColor: '#f13b2f', borderRadius: '50%' }}></div>
          SIMS PPOB
        </Link>
      </div>

      {/* Bagian Kanan: Menu Navigasi */}
      <div style={{ display: 'flex', gap: '30px', fontWeight: 'bold' }}>
        <Link to="/topup" style={{ textDecoration: 'none', color: isActive('/topup') ? '#f13b2f' : 'black' }}>
          Top Up
        </Link>
        <Link to="/transaction" style={{ textDecoration: 'none', color: isActive('/transaction') ? '#f13b2f' : 'black' }}>
          Transaction
        </Link>
        <Link to="/profile" style={{ textDecoration: 'none', color: isActive('/profile') ? '#f13b2f' : 'black' }}>
          Akun
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;