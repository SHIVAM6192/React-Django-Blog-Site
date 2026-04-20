import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import Loader from './Loader';

const ProfilePage = ({ username, currentUser, onPostClick, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Edit Form State
    const [editData, setEditData] = useState({
        bio: '',
        first_name: '',
        last_name: '',
        email: '',
        profile_image: '',
        background_image: ''
    });

    useEffect(() => {
        if(username) fetchProfile();
    }, [username, currentPage]);

    const fetchProfile = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/profile/${username}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
                params: { page: currentPage }
            });
            setProfile(res.data.profile);
            
            if (res.data.posts && res.data.posts.results !== undefined) {
                setPosts(res.data.posts.results);
                setTotalPages(Math.ceil(res.data.posts.count / 6));
            } else {
                setPosts(res.data.posts || []);
                setTotalPages(1);
            }
            
            setEditData(res.data.profile);
        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.put(`${API_BASE_URL}/api/profile/update/`, editData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsEditing(false);
            fetchProfile(); 
        } catch (error) {
            alert("Failed to update profile");
            console.error(error);
        }
    };

    const handleImageChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFollow = async () => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post(`${API_BASE_URL}/api/profile/${username}/follow/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchProfile(); 
        } catch (error) {
            console.error(error);
        }
    };

    if (!profile) return <Loader fullScreen={true} />;

    const isOwnProfile = currentUser === profile.username;

    return (
        <div className="max-w-5xl mx-auto pt-16 pb-12 px-4 sm:px-6">
            
            {/* --- COVER PHOTO --- */}
            <div className="relative bg-white shadow-sm rounded-t-xl overflow-hidden mt-2">
                <div className="h-48 md:h-80 w-full bg-gray-200 relative group">
                    {(isEditing ? editData.background_image : profile.background_image) ? (
                        <img 
                            src={isEditing ? editData.background_image : profile.background_image} 
                            alt="Cover" 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    )}
                    {isEditing && (
                        <>
                            <input type="file" id="bg-image-upload" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'background_image')} />
                            <label htmlFor="bg-image-upload" className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full cursor-pointer shadow-lg hover:scale-105 transition z-10" title="Change Cover">
                                <span role="img" aria-label="edit">✏️</span>
                            </label>
                        </>
                    )}
                </div>
            </div>

            {/* --- PROFILE INFO --- */}
            <div className="bg-white px-6 pb-6 shadow-sm rounded-b-xl relative mb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end">
                    
                    {/* Avatar */}
                    <div className="relative group z-10 -mt-16 md:-mt-20">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-xl">
                            {(isEditing ? editData.profile_image : profile.profile_image) ? (
                                <img src={isEditing ? editData.profile_image : profile.profile_image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-gray-400 bg-gray-100">{profile.username[0].toUpperCase()}</div>
                            )}
                        </div>
                        {isEditing && (
                            <>
                                <input type="file" id="profile-image-upload" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, 'profile_image')} />
                                <label htmlFor="profile-image-upload" className="absolute bottom-2 right-2 bg-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-105 transition z-20" title="Change Avatar">
                                    <span role="img" aria-label="edit">📷</span>
                                </label>
                            </>
                        )}
                    </div>

                    {/* Details */}
                    <div className="mt-4 md:mt-0 md:ml-6 flex-1 text-center md:text-left w-full">
                        {isEditing ? (
                            <div className="space-y-3 mt-4 md:mt-0">
                                <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start">
                                    <input value={editData.first_name} onChange={(e) => setEditData({...editData, first_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg w-full md:w-auto" placeholder="First Name" />
                                    <input value={editData.last_name} onChange={(e) => setEditData({...editData, last_name: e.target.value})} className="border border-gray-300 p-2 rounded-lg w-full md:w-auto" placeholder="Last Name" />
                                </div>
                                <div className="flex justify-center md:justify-start">
                                    <input value={editData.email || ''} onChange={(e) => setEditData({...editData, email: e.target.value})} className="border border-gray-300 p-2 rounded-lg w-full md:w-2/3" placeholder="Email" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h1>
                                <p className="font-semibold text-gray-500">@{profile.username}</p>
                            </>
                        )}
                        <div className="flex justify-center md:justify-start gap-6 mt-4 text-sm font-medium text-gray-600">
                            <span><strong className="text-gray-900">{profile.followers_count}</strong> Followers</span>
                            <span><strong className="text-gray-900">{profile.following_count}</strong> Following</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 md:mb-4 flex gap-3 self-center md:self-end">
                        {isOwnProfile ? (
                            isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-gray-200 rounded-lg font-bold text-gray-700">Cancel</button>
                                    <button onClick={handleUpdateProfile} className="px-5 py-2 bg-green-600 rounded-lg font-bold text-white">Save</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-gray-100 border border-gray-300 rounded-lg font-bold text-gray-700">Edit Profile</button>
                                    {/* LOGOUT BUTTON */}
                                    <button onClick={onLogout} className="px-5 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition">Logout</button>
                                </>
                            )
                        ) : (
                            <button onClick={handleFollow} className={`px-6 py-2 rounded-lg font-bold text-white ${profile.is_following ? 'bg-gray-500' : 'bg-blue-600'}`}>
                                {profile.is_following ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CONTENT & POSTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-xl mb-4 text-gray-800">About</h3>
                        {isEditing ? (
                            <textarea value={editData.bio || ''} onChange={(e) => setEditData({...editData, bio: e.target.value})} className="w-full border p-3 rounded-lg" rows="5" placeholder="Bio..." />
                        ) : (
                            <p className="text-gray-600 whitespace-pre-line text-sm">{profile.bio || "No bio added yet."}</p>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    {posts.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-500">No posts shared yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {posts.map(post => (
                                <div key={post.id} onClick={() => onPostClick(post)} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition flex flex-col h-full">
                                    {post.image ? (
                                        <div className="h-40 w-full bg-gray-100 flex-shrink-0 relative">
                                            <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400 text-2xl flex-shrink-0 relative">
                                            📝
                                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{post.content}</p>
                                        <div className="flex gap-4 text-gray-500 text-sm pt-4 border-t mt-auto">
                                            <span className="flex items-center gap-1"><span className={post.is_liked ? "text-red-500" : ""}>❤️</span> {post.likes_count}</span>
                                            <span className="flex items-center gap-1">💬 {post.comments ? post.comments.length : 0}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* --- PAGINATION CONTROLS --- */}
                    {totalPages > 1 && (
                        <div className="flex justify-between sm:justify-center items-center gap-2 sm:gap-6 p-4 sm:p-6 mt-4 border-t border-gray-100 bg-gray-50/50 rounded-xl w-full">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`px-3 sm:px-5 py-2 text-sm sm:text-base font-bold rounded-lg transition flex items-center ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                                &larr; <span className="hidden md:inline ml-1">Prev</span>
                            </button>
                            <span className="text-gray-700 font-semibold bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md shadow-sm border border-gray-200 text-sm sm:text-base whitespace-nowrap">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-3 sm:px-5 py-2 text-sm sm:text-base font-bold rounded-lg transition flex items-center ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                                <span className="hidden md:inline mr-1">Next</span> &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;