import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null); 

    // Fetch My Posts
    const fetchMyPosts = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/my-posts/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPosts(response.data);
        } catch (error) {
            console.error("Failed to fetch posts", error);
        }
    };

    useEffect(() => { fetchMyPosts(); }, []);

    const handleCreateClick = () => {
        setCurrentPost({
            title: '',
            content: '',
            image: '',
            is_show: true
        });
    };

    const handleEditClick = (post) => {
        setCurrentPost(post);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            if (currentPost.id) {
                await axios.put(`${API_BASE_URL}/api/posts/update/${currentPost.id}/`, currentPost, { headers });
            } else {
                await axios.post(`${API_BASE_URL}/api/posts/create/`, currentPost, { headers });
            }
            setCurrentPost(null);
            fetchMyPosts();
        } catch (error) {
            console.error("Operation failed", error);
            alert("Failed to save post. Please check your data.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPost({...currentPost, image: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-24 px-4 pb-12">
            
            {/* --- HEADER (Responsive Card Style) --- */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 text-center md:text-left">
                    My Posts Manager
                </h2>
                <button 
                    onClick={handleCreateClick}
                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-md transition transform hover:scale-105 flex items-center justify-center"
                >
                    <span className="mr-2 text-xl">+</span> New Post
                </button>
            </div>
            
            {/* --- POST LIST (Responsive Grid/Cards) --- */}
            <div className="grid gap-6">
                {posts.map(post => (
                    <div 
                        key={post.id} 
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-5"
                    >
                        {/* Content Wrapper */}
                        <div className="flex flex-col md:flex-row gap-5 items-center w-full overflow-hidden">
                            
                            {/* Image: Large on mobile, thumbnail on desktop */}
                            <div className="w-full h-48 md:w-32 md:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative group">
                                {post.image ? (
                                    <img src={post.image} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">📝</div>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="min-w-0 w-full text-center md:text-left flex flex-col">
                                <h3 className="font-bold text-xl text-gray-800 mb-2 truncate-lines-2">{post.title}</h3>
                                <p className="text-gray-500 text-sm mb-3 line-clamp-2 md:line-clamp-1">{post.content}</p>
                                
                                {/* Status Badges */}
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.is_show ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {post.is_show ? 'Visible' : 'Hidden'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.is_active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                        {post.is_active ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Edit Button: Full width on mobile, auto on desktop */}
                        <button 
                            onClick={() => handleEditClick(post)}
                            className="w-full md:w-auto bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap flex-shrink-0"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* --- UNIFIED MODAL --- */}
            {currentPost && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white flex-shrink-0">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {currentPost.id ? 'Edit Post' : 'Create New Post'}
                            </h3>
                            <button 
                                onClick={() => setCurrentPost(null)}
                                className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition"
                            >
                                &times;
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input 
                                        type="text"
                                        value={currentPost.title} 
                                        onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-medium" 
                                        placeholder="Enter an engaging title..."
                                        required
                                    />
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                    <textarea 
                                        value={currentPost.content} 
                                        onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-64 resize-y text-gray-700 leading-relaxed" 
                                        placeholder="Write your story here..."
                                        required
                                    />
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                                    <div className="flex items-center gap-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        {currentPost.image ? (
                                            <img src={currentPost.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm" />
                                        ) : (
                                            <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Img</div>
                                        )}
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange} 
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
                                        />
                                    </div>
                                </div>

                                {/* Visibility Toggle */}
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <input 
                                        type="checkbox" 
                                        id="isShow"
                                        checked={currentPost.is_show} 
                                        onChange={(e) => setCurrentPost({...currentPost, is_show: e.target.checked})}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="isShow" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                                        Make this post visible to the public immediately
                                    </label>
                                </div>

                                {/* Footer Actions */}
                                <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                                    <button 
                                        type="button" 
                                        onClick={() => setCurrentPost(null)} 
                                        className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform active:scale-95"
                                    >
                                        {currentPost.id ? 'Save Changes' : 'Publish Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyPosts;