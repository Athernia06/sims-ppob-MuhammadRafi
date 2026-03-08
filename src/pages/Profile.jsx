// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logout } from '../redux/authSlice';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEdit, setIsEdit] = useState(false); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      const data = res.data.data;
      setProfile(data);
      setFirstName(data.first_name);
      setLastName(data.last_name);
    } catch (error) {
      console.error("Gagal mengambil profile", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await api.put('/profile/update', {
        first_name: firstName,
        last_name: lastName
      });
      setProfile(res.data.data);
      setIsEdit(false); 
      setIsError(false);
      setMessage('Profile berhasil diupdate!');
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Gagal update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validasi ukuran maksimal 100KB
    if (file.size > 100 * 1024) {
      setIsError(true);
      setMessage('Ukuran gambar maksimal 100 KB');
      return;
    }

    // 2. Validasi file format 
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setIsError(true);
      setMessage('Format gambar harus JPEG atau PNG');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const res = await api.put('/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // Wajib untuk upload file
      });
      setProfile(res.data.data);
      setIsError(false);
      setMessage('Foto profile berhasil diupdate!');
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || 'Gagal update foto profile');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fungsi Logout ---
  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login'); 
  };

  if (!profile) return null;

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', color: '#333' }}>
      <Navbar />
      
      <div style={{ maxWidth: '600px', margin: '50px auto', padding: '0 20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        
        {/* Foto Profile dengan Tombol Edit Overlay */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <img 
            src={profile.profile_image && profile.profile_image !== "https://null" ? profile.profile_image : "https://via.placeholder.com/120"} 
            alt="Profile" 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc' }}
          />
          {/* Tombol Edit Foto (Pensil) */}
          <button 
            onClick={() => fileInputRef.current.click()} 
            style={{ 
              position: 'absolute', bottom: '5px', right: '5px', 
              backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '50%', 
              padding: '6px', cursor: 'pointer', fontSize: '14px' 
            }}
            title="Edit Foto Profil"
          >
            ✏️
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/jpeg, image/png" 
            style={{ display: 'none' }} 
          />
        </div>

        <h2 style={{ margin: '0 0 30px 0', fontSize: '28px' }}>{profile.first_name} {profile.last_name}</h2>

        {/* Notifikasi */}
        {message && (
          <div style={{ color: isError ? 'red' : 'green', backgroundColor: isError ? '#fee2e2' : '#dcfce3', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        {/* Form Data Diri */}
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input 
              type="email" 
              value={profile.email} 
              disabled 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', color: '#888', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Nama Depan</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              disabled={!isEdit} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: isEdit ? 'white' : '#f9f9f9', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Nama Belakang</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              disabled={!isEdit} 
              style={{ width: '100%', padding: '12px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: isEdit ? 'white' : '#f9f9f9', boxSizing: 'border-box' }} 
            />
          </div>

          {/* Area Tombol */}
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {!isEdit ? (
              <>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    setIsEdit(true);
                  }} 
                  style={{ padding: '15px', backgroundColor: 'white', color: '#f13b2f', border: '1px solid #f13b2f', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Edit Profile
                </button>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }} 
                  style={{ padding: '15px', backgroundColor: '#f13b2f', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  style={{ padding: '15px', backgroundColor: '#f13b2f', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Simpan
                </button>
                <button 
                  type="button" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setIsEdit(false); 
                    setFirstName(profile.first_name); 
                    setLastName(profile.last_name); 
                  }} 
                  style={{ padding: '15px', backgroundColor: 'white', color: '#f13b2f', border: '1px solid #f13b2f', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Batalkan
                </button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default Profile;