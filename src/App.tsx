import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Goals from './pages/Goals';
import CheckIns from './pages/CheckIns';
import Members from './pages/Members';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Import CSS for animations
import './styles/animations.css';

function App() {
  return (
    <AppProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Goals />} />
            <Route path="goals" element={<Goals />} />
            <Route path="check-ins" element={<CheckIns />} />
            <Route path="members" element={<Members />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Goals />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;