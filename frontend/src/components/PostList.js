import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Accept onPostClick prop
const PostList = ({ refreshTrigger, onPostClick }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const response = await axios.get('http://127.0.0.1:8000/api/posts/', {
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
                        <div className="flex items-center text-xs text-blue-600 font-semibold mt-auto pt-4 border-t border-gray-100">
                            READ MORE →
                            <span className="ml-auto text-gray-400 font-normal">By @{post.author}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;