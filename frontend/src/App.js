import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register'; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [username, setUsername] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // 1. Fetch User Profile
  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    }
  }, [token]);

  const fetchUserProfile = async (currentToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      handleLogout(); 
    }
  };

  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (token && refreshToken) {
        await axios.post('http://127.0.0.1:8000/api/logout/', 
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
      setUsername('');
    }
  };

  const handleRegisterSuccess = () => {
     setAuthMode('login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar 
        isLoggedIn={!!token} 
        username={username} 
        onLogout={handleLogout} 
        onLoginClick={() => {
            setAuthMode('login');
            setShowLoginModal(true);
        }}
        onRegisterClick={() => {
            setAuthMode('register');
            setShowLoginModal(true);
        }}
      />

      {token ? (
        <Dashboard />
      ) : (
        <LandingPage onLoginClick={() => {
            setAuthMode('login');
            setShowLoginModal(true);
        }} />
      )}

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
                        onRegisterSuccess={handleRegisterSuccess} 
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