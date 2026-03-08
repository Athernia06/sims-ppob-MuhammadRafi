// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import Payment from './pages/Payment';
import Transaction from './pages/Transaction';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Publik (Tidak perlu login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        
        {/* Route Privat (Wajib login) */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/topup" element={<ProtectedRoute><TopUp /></ProtectedRoute>} />
        <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/topup" element={<ProtectedRoute><TopUp /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;