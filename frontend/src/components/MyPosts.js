import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]); // Store categories
    const [currentPost, setCurrentPost] = useState(null); // For Edit/Create Modal
    const [postToDelete, setPostToDelete] = useState(null); // For Delete Confirmation Modal

    // Initial Fetch (Posts & Categories)
    useEffect(() => {
        fetchMyPosts();
        fetchCategories();
    }, []);

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

    const fetchCategories = async () => {
        try {
            // No auth needed for categories usually, but sending token doesn't hurt
            const response = await axios.get(`${API_BASE_URL}/api/categories/`);
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    // --- CREATE / EDIT HANDLERS ---
    const handleCreateClick = () => {
        setCurrentPost({ 
            title: '', 
            content: '', 
            image: '', 
            category: '', // Initialize empty for requirement check
            is_show: true 
        });
    };

    const handleEditClick = (post) => {
        // Ensure we pass the category ID. If it's null, default to empty string
        setCurrentPost({
            ...post,
            category: post.category || '' 
        });
    };

    // --- DELETE HANDLERS ---
    const handleDeleteClick = (post) => {
        setPostToDelete(post);
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        
        const token = localStorage.getItem('access_token');
        try {
            await axios.delete(`${API_BASE_URL}/api/posts/delete/${postToDelete.id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPostToDelete(null);
            fetchMyPosts();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete post.");
        }
    };

    // --- FORM SUBMISSION ---
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
            fetchMyPosts(); // Refresh list to show updates
        } catch (error) {
            console.error("Operation failed", error);
            alert("Failed to save post. Please check your data.");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setCurrentPost({...currentPost, image: reader.result}); };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pt-24 px-4 pb-12">
            
            {/* --- HEADER --- */}
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
            
            {/* --- POST LIST --- */}
            <div className="grid gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-5">
                        
                        <div className="flex flex-col md:flex-row gap-5 items-center w-full overflow-hidden">
                            {/* Image */}
                            <div className="w-full h-48 md:w-32 md:h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative group">
                                {post.image ? (
                                    <img src={post.image} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">📝</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 w-full text-center md:text-left flex flex-col">
                                <h3 className="font-bold text-xl text-gray-800 mb-2 truncate-lines-2">{post.title}</h3>
                                
                                {/* Category Badge */}
                                {post.category_name && (
                                    <span className="mb-2 inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded w-fit mx-auto md:mx-0">
                                        {post.category_name}
                                    </span>
                                )}

                                <p className="text-gray-500 text-sm mb-3 line-clamp-2 md:line-clamp-1">{post.content}</p>
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

                        {/* BUTTON GROUP (Edit & Delete) */}
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto flex-shrink-0">
                            <button 
                                onClick={() => handleEditClick(post)}
                                className="w-full md:w-auto bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDeleteClick(post)}
                                className="w-full md:w-auto bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap"
                            >
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>

            {/* --- CREATE / EDIT MODAL --- */}
            {currentPost && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white flex-shrink-0">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {currentPost.id ? 'Edit Post' : 'Create New Post'}
                            </h3>
                            <button onClick={() => setCurrentPost(null)} className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition">&times;</button>
                        </div>
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                    <input type="text" value={currentPost.title} onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-medium" placeholder="Enter an engaging title..." required />
                                </div>

                                {/* Category Dropdown (NEW) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                                    <select 
                                        value={currentPost.category} 
                                        onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        required
                                    >
                                        <option value="">Select a Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                    <textarea value={currentPost.content} onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-64 resize-y text-gray-700 leading-relaxed" placeholder="Write your story here..." required />
                                </div>

                                {/* Image */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
                                    <div className="flex items-center gap-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        {currentPost.image ? <img src={currentPost.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg shadow-sm" /> : <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No Img</div>}
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
                                    </div>
                                </div>

                                {/* Toggle */}
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                    <input type="checkbox" id="isShow" checked={currentPost.is_show} onChange={(e) => setCurrentPost({...currentPost, is_show: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                                    <label htmlFor="isShow" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">Make this post visible to the public immediately</label>
                                </div>

                                {/* Footer */}
                                <div className="flex gap-3 justify-end pt-6 border-t border-gray-100">
                                    <button type="button" onClick={() => setCurrentPost(null)} className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition">Cancel</button>
                                    <button type="submit" className="px-8 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform active:scale-95">{currentPost.id ? 'Save Changes' : 'Publish Post'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {postToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-fade-in-up overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                ⚠️
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Post?</h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Are you sure you want to delete <strong>"{postToDelete.title}"</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button 
                                    onClick={() => setPostToDelete(null)}
                                    className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition w-full border border-gray-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transition w-full"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
export default MyPosts;