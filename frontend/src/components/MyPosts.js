import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null); // Which post is being edited?

    // Fetch My Posts
    const fetchMyPosts = async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/my-posts/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setPosts(response.data);
    };

    useEffect(() => { fetchMyPosts(); }, []);

    // Handle Edit Click
    const handleEditClick = (post) => {
        setEditingPost(post);
    };

    // Handle Save Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.put(`http://127.0.0.1:8000/api/posts/update/${editingPost.id}/`, 
                editingPost, // Send the updated object
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setEditingPost(null); // Close modal/form
            fetchMyPosts(); // Refresh list
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    // Handle Image Change in Edit Mode
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingPost({...editingPost, image: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pt-24 px-4">
            <h2 className="text-2xl font-bold mb-6">My Posts Manager</h2>
            
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-start">
                        <div className="flex gap-4">
                            {post.image && <img src={post.image} alt="Cover" className="w-20 h-20 object-cover rounded" />}
                            <div>
                                <h3 className="font-bold text-lg">{post.title}</h3>
                                <p className="text-gray-600 text-sm truncate w-64">{post.content}</p>
                                <div className="mt-2 text-xs space-x-2">
                                    <span className={`px-2 py-1 rounded ${post.is_show ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {post.is_show ? 'Visible' : 'Hidden'}
                                    </span>
                                    <span className={`px-2 py-1 rounded ${post.is_active ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                        {post.is_active ? 'Active (Admin)' : 'Inactive (Admin)'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleEditClick(post)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Modal / Form */}
            {editingPost && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Edit Post</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm">Title</label>
                                <input 
                                    value={editingPost.title} 
                                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                    className="w-full border p-2 rounded" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Content</label>
                                <textarea 
                                    value={editingPost.content} 
                                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                    className="w-full border p-2 rounded h-24" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm">Change Image</label>
                                <input type="file" onChange={handleEditImageChange} className="text-sm" />
                            </div>
                            <div className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    checked={editingPost.is_show} 
                                    onChange={(e) => setEditingPost({...editingPost, is_show: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <label className="ml-2">Show to public?</label>
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setEditingPost(null)} className="text-gray-500 px-4 py-2">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MyPosts;