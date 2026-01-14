import React from 'react';

const LandingPage = ({ onLoginClick }) => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1499750310159-52f0f8325cc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
          Share Your Story.
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Join a community of writers and readers. Discover the latest tech trends, tutorials, and personal journeys.
        </p>
        <button 
          onClick={onLoginClick}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:scale-105 transition transform duration-200"
        >
          Start Reading Now
        </button>
      </div>
    </div>
  );
};

export default LandingPage;