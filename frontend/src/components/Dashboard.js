import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 pb-12"> {/* pt-24 pushes it below fixed navbar */}
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Latest Posts</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
        >
          {showCreateForm ? 'Close Editor' : '+ Write Post'}
        </button>
      </div>

      {/* Accordion-style Create Post Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 transition-all">
          <CreatePost onPostCreated={() => {
            setRefreshTrigger(prev => prev + 1);
            setShowCreateForm(false); // Close after posting
          }} />
        </div>
      )}

      {/* Post List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
        <PostList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default Dashboard;