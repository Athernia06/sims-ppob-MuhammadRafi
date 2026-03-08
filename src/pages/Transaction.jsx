// src/pages/Transaction.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const Transaction = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Untuk menyembunyikan tombol jika data habis
  const limit = 5;

  useEffect(() => {
    fetchBalance();
    fetchTransactions(0); // Ambil 5 data pertama saat halaman dimuat
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await api.get('/balance');
      setBalance(res.data.data.balance);
    } catch (error) {
      console.error("Gagal mengambil saldo", error);
    }
  };

  const fetchTransactions = async (currentOffset) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/transaction/history?offset=${currentOffset}&limit=${limit}`);
      const newTransactions = res.data.data.records;

      if (newTransactions.length === 0) {
        setHasMore(false); // Jika tidak ada data lagi, sembunyikan tombol
      } else {
        // Gabungkan data lama dengan data baru
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

  // Fungsi untuk format tanggal menjadi "17 Agustus 2023, 13:10 WIB"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
    return date.toLocaleDateString('id-ID', options);
  };

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

        <h3 style={{ marginBottom: '20px' }}>Transaksi</h3>

        {/* List Transaksi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
          {transactions.length === 0 && !isLoading ? (
            <p style={{ textAlign: 'center', color: '#888' }}>Belum ada transaksi.</p>
          ) : (
            transactions.map((trx, index) => {
              // Tentukan warna berdasarkan jenis transaksi (TOPUP atau PAYMENT)
              const isTopUp = trx.transaction_type === 'TOPUP';
              const textColor = isTopUp ? 'green' : 'red';
              const sign = isTopUp ? '+' : '-';

              return (
                <div key={index} style={{ 
                  border: '1px solid #eaeaea', 
                  borderRadius: '10px', 
                  padding: '15px 20px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
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

        {/* Tombol Show More */}
        {hasMore && transactions.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <button 
              onClick={handleShowMore}
              disabled={isLoading}
              style={{
                background: 'none',
                color: '#f13b2f',
                border: 'none',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
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