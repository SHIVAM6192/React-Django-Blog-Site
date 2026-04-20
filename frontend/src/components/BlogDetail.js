import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const BlogDetail = ({ post, onBack, refreshPost }) => { // refreshPost is a callback to re-fetch data
    const [comment, setComment] = useState('');
    const [localPost, setLocalPost] = useState(post); // Manage local state for immediate UI updates

    const handleLike = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.post(`${API_BASE_URL}/api/posts/${post.id}/like/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update local state immediately
            setLocalPost(prev => ({
                ...prev,
                is_liked: res.data.status === 'liked',
                likes_count: res.data.likes_count
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            const res = await axios.post(`${API_BASE_URL}/api/posts/${post.id}/comment/`, 
                { content: comment }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Append new comment to local state
            setLocalPost(prev => ({
                ...prev,
                comments: [...prev.comments, res.data]
            }));
            setComment('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleFollow = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        try {
            if (localPost.is_following_author) {
                await axios.post(`${API_BASE_URL}/api/profile/unfollow/`, { user_id: localPost.author_id }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLocalPost(prev => ({ ...prev, is_following_author: false }));
            } else {
                await axios.post(`${API_BASE_URL}/api/profile/follow/`, { user_id: localPost.author_id }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setLocalPost(prev => ({ ...prev, is_following_author: true }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-24 px-4 pb-12">
            <button onClick={onBack} className="mb-6 text-gray-600 hover:text-blue-600">← Back</button>
            
            {/* BLOG CONTENT */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="h-64 md:h-96 w-full bg-gray-200">
                    {localPost.image && <img src={localPost.image} alt="Cover" className="w-full h-full object-cover" />}
                </div>
                <div className="p-8">
                    {/* Category Badge */}
                    {localPost.category_name && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">
                            {localPost.category_name}
                        </span>
                    )}
                    <h1 className="text-4xl font-bold mb-4">{localPost.title}</h1>
                    <div className="flex items-center justify-between gap-4 mb-8 border-b pb-6">
                        <div className="flex items-center gap-2">
                             {/* Avatar */}
                             <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {localPost.author_image ? <img src={localPost.author_image} className="w-full h-full object-cover" /> : null}
                             </div>
                             <div>
                                <span className="font-bold text-gray-900">@{localPost.author}</span>
                                <span className="block text-xs text-gray-500">{new Date(localPost.created_at).toLocaleDateString()}</span>
                             </div>
                        </div>

                        {/* Follow Button */}
                        {!localPost.is_author && (
                            <button
                                onClick={handleFollow}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                                    localPost.is_following_author 
                                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {localPost.is_following_author ? 'Following' : 'Follow'}
                            </button>
                        )}
                    </div>
                    <div className="prose max-w-none text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-8">
                        {localPost.content}
                    </div>

                    {/* INTERACTION SECTION */}
                    <div className="flex items-center gap-6 border-t pt-6">
                        <button 
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${localPost.is_liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            <span className="text-2xl">{localPost.is_liked ? '❤️' : '🤍'}</span>
                            <span className="font-bold">{localPost.likes_count} Likes</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold mb-6">Comments ({localPost.comments.length})</h3>
                
                {/* Add Comment */}
                <form onSubmit={handleComment} className="mb-8 flex items-center gap-2 bg-gray-50 md:bg-white p-2 md:p-3 rounded-full shadow-inner md:shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                    <input 
                        type="text" 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a thoughtful comment..."
                        className="flex-1 bg-transparent px-3 md:px-4 py-1 md:py-2 outline-none text-gray-700 text-sm md:text-base w-full"
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={!comment.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2.5 md:p-3 rounded-full flex-shrink-0 shadow-md transition transform"
                        title="Send Comment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                        </svg>
                    </button>
                </form>

                {/* List Comments */}
                <div className="space-y-4">
                    {localPost.comments.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-50 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                                {c.user_image ? <img src={c.user_image} className="w-full h-full object-cover"/> : null}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">@{c.user}</span>
                                    <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-700">{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;