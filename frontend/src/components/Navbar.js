import React, { useState } from 'react';

const Navbar = ({ isLoggedIn, user, onLogout, onLoginClick, onRegisterClick, onMyPostsClick, onLogoClick, onProfileClick }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to extract initial
  const getInitial = () => user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-slate-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div
            onClick={onLogoClick}
            className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Shivam's Blog
            </h1>
          </div>

          {/* DESKTOP MENU (Hidden on Mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={onMyPostsClick}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  My Posts
                </button>

                {/* Profile Icon */}
                <div 
                    onClick={onProfileClick}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-slate-800 rounded-full pr-3 pl-1 py-1 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">
                    {getInitial()}
                  </div>
                  <span className="text-gray-300 font-medium text-sm">{user?.username}</span>
                </div>

                <button 
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-3">
                <button onClick={onLoginClick} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</button>
                <button onClick={onRegisterClick} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium shadow-md">Sign Up</button>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white focus:outline-none p-2"
            >
              {/* Hamburger / Close Icon SVG Switch */}
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                {/* Mobile Profile Section */}
                <button 
                    onClick={() => { onProfileClick(); setIsMobileOpen(false); }}
                    className="w-full text-left flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-slate-700"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-3">
                        {getInitial()}
                    </div>
                    <div>
                        <div className="text-sm font-bold">{user?.username}</div>
                        <div className="text-xs text-gray-400">View Profile</div>
                    </div>
                </button>

                <button
                  onClick={() => { onMyPostsClick(); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  My Posts
                </button>

                <button
                  onClick={() => { onLogout(); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onLoginClick(); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  Login
                </button>
                <button
                  onClick={() => { onRegisterClick(); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;