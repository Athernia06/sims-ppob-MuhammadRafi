// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null, 
  user: null, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); 
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token'); 
    },
    setProfile: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;