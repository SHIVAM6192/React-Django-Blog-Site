import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register'; 
import MyPosts from './components/MyPosts';
import ProfileModal from './components/ProfileModal';
import { API_BASE_URL } from './config';

function App() {
  const [view, setView] = useState('dashboard');
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  
  // Changed: Store full user object, not just username
  const [user, setUser] = useState(null); 
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // New State
  const [authMode, setAuthMode] = useState('login');
  const [dashboardKey, setDashboardKey] = useState(0);

  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  const fetchUserProfile = async (currentToken) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/profile/`, {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      handleLogout(); 
    }
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setView('dashboard');
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (token && refreshToken) {
        await axios.post(`${API_BASE_URL}/api/logout/`, 
          { "refresh_token": refreshToken }, 
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
      setView('dashboard');
    }
  };

  const handleLogoClick = () => {
    setView('dashboard');
    setDashboardKey(prev => prev + 1); 
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar 
        isLoggedIn={!!token} 
        user={user}
        onLogout={handleLogout} 
        onLoginClick={() => {
            setAuthMode('login');
            setShowLoginModal(true);
        }}
        onRegisterClick={() => {
            setAuthMode('register');
            setShowLoginModal(true);
        }}
        onMyPostsClick={() => setView('myposts')} 
        onLogoClick={handleLogoClick}
        onProfileClick={() => setShowProfileModal(true)}
      />

      {/* CONTENT SWITCHER */}
      {token ? (
        view === 'myposts' ? (
          <MyPosts />
        ) : (
          <Dashboard key={dashboardKey} />
        )
      ) : (
        <LandingPage onLoginClick={() => {
            setAuthMode('login');
            setShowLoginModal(true);
        }} />
      )}

      {/* PROFILE MODAL */}
      {showProfileModal && user && (
        <ProfileModal 
            user={user} 
            onClose={() => setShowProfileModal(false)} 
        />
      )}

      {/* AUTH MODAL */}
      {showLoginModal && !token && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl"
            >
              &times;
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              
              {authMode === 'login' ? (
                <>
                  <Login onLoginSuccess={handleLoginSuccess} />
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button 
                            onClick={() => setAuthMode('register')} 
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                    <Register 
                        onRegisterSuccess={() => setAuthMode('login')} 
                        switchToLogin={() => setAuthMode('login')} 
                    />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;