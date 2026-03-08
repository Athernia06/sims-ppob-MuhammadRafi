// src/services/api.js
import axios from 'axios';

// Ganti baseURL ini dengan URL API yang ada di dokumentasi (Swagger/Postman)
const api = axios.create({
  baseURL: 'https://take-home-test-api.nutech-integrasi.com', // Sesuaikan dengan dokumentasi
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyisipkan token secara otomatis ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;