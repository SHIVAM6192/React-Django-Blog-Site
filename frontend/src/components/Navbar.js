import React, { useState } from 'react';

const Navbar = ({ isLoggedIn, user, onLogout, onLoginClick, onRegisterClick, onMyPostsClick, onLogoClick, onProfileClick }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Helper to extract initial
  const getInitial = () => user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <nav className="bg-slate-900 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LEFT SIDE: LOGO */}
          <div
            onClick={onLogoClick}
            className="flex-shrink-0 flex items-center cursor-pointer hover:opacity-80 transition"
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Shivam's Blog
            </h1>
          </div>

          {/* RIGHT SIDE: DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Navigation Buttons */}
            {isLoggedIn ? (
              <>
                <button
                  onClick={onMyPostsClick}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  My Posts
                </button>
                {/* Logout Removed from here */}
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Profile Icon (Only shows if logged in) */}
            {isLoggedIn && (
              <div 
                className="ml-2 w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold cursor-pointer hover:opacity-80 transition overflow-hidden border-2 border-slate-700"
                onClick={onProfileClick}
                title="View Profile"
              >
                {user?.profile_image ? (
                    <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    getInitial()
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
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

      {/* MOBILE MENU (Dropdown) */}
      {isMobileOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                <div 
                    className="flex items-center px-3 py-2 mb-2 border-b border-slate-700 cursor-pointer" 
                    onClick={() => { onProfileClick(); setIsMobileOpen(false); }}
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold mr-3 overflow-hidden">
                        {user?.profile_image ? (
                            <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            getInitial()
                        )}
                    </div>
                    <span className="font-medium text-white">{user?.username}</span>
                </div>

                <button
                  onClick={() => { onMyPostsClick(); setIsMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700"
                >
                  My Posts
                </button>
                {/* Keep Logout in Mobile Menu for accessibility */}
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