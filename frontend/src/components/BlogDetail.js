import React from 'react';

const BlogDetail = ({ post, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto pt-24 px-4 pb-12">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition font-medium"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Large Cover Image */}
        <div className="h-64 md:h-96 w-full bg-gray-200 relative">
          {post.image ? (
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-4xl">📝</span>
            </div>
          )}
        </div>

        <div className="p-8 md:p-12">
          {/* Header Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                @{post.author || 'User'}
             </span>
             <span>•</span>
             <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Content Body - with whitespace handling */}
          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;