import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostList from './PostList';
import BlogDetail from './BlogDetail';

const Dashboard = ({ onAuthorClick }) => { // 1. Accept the prop
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  // VIEW 1: READ POST (Detail View)
  if (selectedPost) {
    return (
      <BlogDetail 
        post={selectedPost} 
        onBack={() => setSelectedPost(null)} 
        onAuthorClick={onAuthorClick} // 2. Pass it to Detail View
      />
    );
  }

  // VIEW 2: CREATE POST (Writer View)
  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto pt-24 px-4 pb-12">
        {/* Back Button */}
        <button 
            onClick={() => setIsCreating(false)}
            className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition font-medium"
        >
            ← Back to Dashboard
        </button>

        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Draft a New Story</h2>
            <p className="text-gray-500 mb-8">Share your knowledge with the community.</p>
            
            <CreatePost onPostCreated={() => {
                setRefreshTrigger(prev => prev + 1); // Refresh list for when we return
                setIsCreating(false); // Go back to dashboard
            }} />
        </div>
      </div>
    );
  }

  // VIEW 3: DASHBOARD (Banner + Grid)
  return (
    <div className="min-h-screen pb-12">
      
      {/* --- HERO BANNER --- */}
      <div className="relative bg-gray-900 h-80 md:h-[400px] w-full pt-16">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Blog Banner" 
            className="w-full h-full object-cover absolute inset-0 z-0"
        />
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">
                Explore the World of Tech
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-md">
                Discover stories, thinking, and expertise from writers on any topic.
            </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-30">
        
        {/* Controls Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex flex-col lg:flex-row justify-between items-center border border-gray-100 gap-4">
            
            {/* Search Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:flex-1">
                <input 
                    type="text" 
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input 
                    type="date" 
                    value={dateQuery}
                    onChange={(e) => setDateQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                {(searchQuery || dateQuery) && (
                    <button 
                        onClick={() => { setSearchQuery(''); setDateQuery(''); }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium transition"
                        title="Clear Search"
                    >
                        Clear
                    </button>
                )}
            </div>

            <button 
                onClick={() => setIsCreating(true)} // Switches to Create View
                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold shadow-md transition transform hover:scale-105 whitespace-nowrap"
            >
                Write a Story ✍️
            </button>
        </div>

        {/* Post Grid */}
        <div className="bg-gray-50 rounded-xl">
             <PostList 
                refreshTrigger={refreshTrigger} 
                onPostClick={(post) => setSelectedPost(post)} 
                onAuthorClick={onAuthorClick} // 3. Pass it to Post List
                searchQuery={searchQuery}
                dateQuery={dateQuery}
             />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;