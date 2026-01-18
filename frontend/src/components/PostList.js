import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const PostList = ({ refreshTrigger, onPostClick }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {   
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const response = await axios.get(`${API_BASE_URL}/api/posts/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        };
        fetchPosts();
    }, [refreshTrigger]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {posts.map(post => (
                <div 
                    key={post.id} 
                    onClick={() => onPostClick(post)}
                    className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition transform hover:-translate-y-1 duration-300 flex flex-col h-full"
                >
                    {/* Image Area */}
                    <div className="h-48 bg-gray-200 w-full relative">
                        {post.image ? (
                            <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <span className="text-3xl">📝</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-600 shadow-sm">
                            {new Date(post.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                            {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                            {post.content}
                        </p>

                        {/* --- NEW FOOTER: Author, Likes, Comments --- */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                            
                            {/* Author Name */}
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-700 text-sm">
                                    {post.author_first_name || post.author}
                                </span>
                            </div>

                            {/* Icons & Counts */}
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                
                                {/* Likes Section */}
                                <div className="flex items-center gap-1" title="Likes">
                                    {/* Heart Icon */}
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className={`h-5 w-5 ${post.is_liked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className={`font-medium ${post.is_liked ? 'text-red-600' : ''}`}>
                                        {post.likes_count}
                                    </span>
                                </div>

                                {/* Comments Section */}
                                <div className="flex items-center gap-1" title="Comments">
                                    {/* Comment Bubble Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span className="font-medium">
                                        {post.comments ? post.comments.length : 0}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;