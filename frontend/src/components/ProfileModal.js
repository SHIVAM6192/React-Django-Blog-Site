import React from 'react';

const ProfileModal = ({ user, onClose, onViewProfile }) => {
    if (!user) return null;

    // Use image if available, else use a default gradient
    const bgStyle = user.background_image 
        ? { backgroundImage: `url(${user.background_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                    &times;
                </button>

                {/* Header (Cover Image) */}
                <div style={bgStyle} className="h-32 w-full relative"></div>

                {/* Avatar Bubble - Overlapping */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden relative">
                            {user.profile_image ? (
                                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-3xl font-bold">
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="pt-16 pb-6 px-6 text-center mt-2">
                    <h2 className="text-xl font-bold text-gray-800">
                        {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-blue-600 font-medium text-sm mb-4">@{user.username}</p>

                    {/* Bio Snippet */}
                    {user.bio && (
                        <p className="text-gray-500 text-sm mb-6 italic line-clamp-2">
                            "{user.bio}"
                        </p>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                onClose(); // Close modal
                                onViewProfile(user.username); // Navigate to page
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow-md transition"
                        >
                            View Full Profile
                        </button>
                        
                        <div className="text-xs text-gray-400 pt-2 border-t">
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;