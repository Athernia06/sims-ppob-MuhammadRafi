// src/pages/Transaction.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Transaction = () => {
  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  useEffect(() => {
    fetchData();
    fetchTransactions(0);
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

  const fetchTransactions = async (currentOffset) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/transaction/history?offset=${currentOffset}&limit=${limit}`);
      const newTransactions = res.data.data.records;

      if (newTransactions.length === 0) {
        setHasMore(false);
      } else {
        setTransactions((prev) => [...prev, ...newTransactions]);
      }
    } catch (error) {
      console.error("Gagal mengambil riwayat transaksi", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchTransactions(nextOffset);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return date.toLocaleDateString('id-ID', options);
  };

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

        <h3 style={{ marginBottom: '20px' }}>Transaksi</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          {transactions.length === 0 && !isLoading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Belum ada transaksi.</p>
          ) : (
            transactions.map((trx, index) => {
              const isTopUp = trx.transaction_type === 'TOPUP';
              const textColor = isTopUp ? 'green' : 'red';
              const sign = isTopUp ? '+' : '-';

              return (
                <div key={index} style={{ border: '1px solid #eaeaea', borderRadius: '10px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: textColor, fontSize: '20px' }}>
                      {sign} Rp {trx.total_amount.toLocaleString('id-ID')}
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>
                      {formatDate(trx.created_on)}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
                      {trx.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {hasMore && transactions.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={handleShowMore}
              disabled={isLoading}
              style={{ background: 'none', color: '#f13b2f', border: 'none', fontWeight: 'bold', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '16px' }}
            >
              {isLoading ? 'Memuat...' : 'Show more'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Transaction;