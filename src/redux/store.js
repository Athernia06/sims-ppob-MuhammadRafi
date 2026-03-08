// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Nanti kalau ada state lain (misal untuk transaksi), bisa ditambahkan di sini
  },
});