import React from 'react';

// 1. Accept 'onRegisterClick' as a new prop
const Navbar = ({ isLoggedIn, username, onLogout, onLoginClick, onRegisterClick }) => {
  return (
    <nav className="bg-slate-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Shivam's Blog Site
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-gray-300 font-medium">{username}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              // 2. SHOW BOTH BUTTONS WHEN LOGGED OUT
              <div className="flex space-x-3">
                <button 
                  onClick={onLoginClick}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </button>
                <button 
                  onClick={onRegisterClick}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;