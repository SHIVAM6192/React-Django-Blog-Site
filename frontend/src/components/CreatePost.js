import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/posts/create/', 
                {
                    title: title,
                    content: content
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            console.log("Post created:", response.data);
            
            // Clear the form
            setTitle('');
            setContent('');
            
            // Notify parent to refresh the list
            if (onPostCreated) {
                onPostCreated();
            }

        } catch (error) {
            console.error("Error creating post", error);
            alert("Failed to create post.");
        }
    };

    return (
        <div style={{ border: '1px solid #333', padding: '15px', margin: '20px 0', borderRadius: '5px' }}>
            <h3>Write a New Post</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <textarea 
                        placeholder="Content" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', padding: '8px', height: '100px' }}
                        required
                    />
                </div>
                <button type="submit" style={{ padding: '8px 16px', background: 'green', color: 'white' }}>
                    Publish
                </button>
            </form>
        </div>
    );
};

export default CreatePost;