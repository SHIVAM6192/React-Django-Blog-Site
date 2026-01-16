import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(''); // Base64 string
    const [isShow, setIsShow] = useState(true);

    // Helper: Convert file to Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // This looks like "data:image/jpeg;base64,..."
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('http://127.0.0.1:8000/api/posts/create/', 
                { title, content, image, is_show: isShow },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Reset form
            setTitle(''); setContent(''); setImage(''); setIsShow(true);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            alert("Failed to create post");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} 
                className="w-full border p-2 rounded" required 
            />
            <textarea 
                placeholder="Content" value={content} onChange={(e)=>setContent(e.target.value)} 
                className="w-full border p-2 rounded h-24" required 
            />
            
            {/* Image Input */}
            <div>
                <label className="block text-sm text-gray-600 mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            {/* IsShow Toggle */}
            <div className="flex items-center">
                <input 
                    type="checkbox" checked={isShow} onChange={(e) => setIsShow(e.target.checked)} 
                    className="w-4 h-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Make this post visible to others?</label>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                Publish Post
            </button>
        </form>
    );
};
export default CreatePost;