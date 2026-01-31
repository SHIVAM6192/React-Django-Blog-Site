import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const ProfilePage = ({ username, currentUser, onPostClick, onLogout }) => {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    
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
    }, [username]);

    const fetchProfile = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.get(`${API_BASE_URL}/api/profile/${username}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(res.data.profile);
            setPosts(res.data.posts);
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

    if (!profile) return <div className="pt-24 text-center font-medium text-gray-500">Loading Profile...</div>;

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
                        posts.map(post => (
                            <div key={post.id} onClick={() => onPostClick(post)} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition">
                                {post.image && <div className="h-64 w-full bg-gray-100"><img src={post.image} alt="Post" className="w-full h-full object-cover" /></div>}
                                <div className="p-6">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.content}</p>
                                    <div className="flex gap-6 text-gray-500 text-sm pt-4 border-t">
                                        <span>❤️ {post.likes_count}</span><span>💬 {post.comments.length}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;