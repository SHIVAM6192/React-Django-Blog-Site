import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Notice the { refreshTrigger } inside the parentheses
const PostList = ({ refreshTrigger }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('access_token');

                // If we don't have a token, stop here so we don't get errors
                if (!token) return;

                const response = await axios.get('http://127.0.0.1:8000/api/posts/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        };

        fetchPosts();

        // 2. This array tells React: "Run this effect again whenever refreshTrigger changes"
    }, [refreshTrigger]);

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto' }}>
            {posts.map(post => (
                <div key={post.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>
                    <div className="flex items-center text-xs text-gray-400">
                        <span className="font-semibold text-blue-500 mr-2">@{post.author || 'User'}</span>
                        <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostList;