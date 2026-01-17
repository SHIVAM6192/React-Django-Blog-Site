import React from 'react';

const ProfileModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                {/* Header with Colorful Background */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
                    >
                        &times;
                    </button>
                    {/* Avatar Bubble */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">
                                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="pt-12 pb-8 px-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-blue-600 font-medium mb-6">@{user.username}</p>

                    <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3 border border-gray-100">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                            <p className="text-gray-700 font-medium">{user.email || 'No email provided'}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                            <p className="text-gray-700 font-medium">
                                {user.first_name && user.last_name 
                                    ? `${user.first_name} ${user.last_name}` 
                                    : 'Not provided'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;