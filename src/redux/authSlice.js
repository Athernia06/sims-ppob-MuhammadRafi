// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Ambil token dari localStorage jika halaman di-refresh
  token: localStorage.getItem('token') || null, 
  user: null, // Untuk menyimpan data profile
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); // Simpan token ke browser
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token'); // Hapus token saat logout
    },
    setProfile: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;