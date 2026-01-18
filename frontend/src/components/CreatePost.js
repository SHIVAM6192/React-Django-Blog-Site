import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isShow, setIsShow] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        // Fetch Categories
        const fetchCategories = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const res = await axios.get(`${API_BASE_URL}/api/categories/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setImage(reader.result); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.post(`${API_BASE_URL}/api/posts/create/`, 
                { 
                    title, 
                    content, 
                    image, 
                    is_show: isShow,
                    category: selectedCategory // Send Category ID
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Reset
            setTitle(''); setContent(''); setImage(''); setIsShow(true); setSelectedCategory('');
            if (onPostCreated) onPostCreated();
        } catch (error) {
            alert("Failed to create post");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input 
                    type="text" value={title} onChange={(e)=>setTitle(e.target.value)} 
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required 
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option value="">Select a Category...</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>
                <textarea 
                    value={content} onChange={(e)=>setContent(e.target.value)} 
                    className="w-full border px-4 py-2 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none" required 
                />
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            </div>

            <div className="flex items-center">
                <input 
                    type="checkbox" checked={isShow} onChange={(e) => setIsShow(e.target.checked)} 
                    className="w-4 h-4 text-blue-600 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Make this post visible to public?</label>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 w-full transition shadow-md">
                Publish Post
            </button>
        </form>
    );
};
export default CreatePost;