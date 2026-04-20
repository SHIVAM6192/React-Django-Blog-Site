import React from 'react';

const Loader = ({ fullScreen = false }) => {
    const loaderContent = (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 font-bold tracking-wide bg-clip-text text-transparent animate-pulse">
                Loading...
            </span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-[100] flex items-center justify-center">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center py-16">
            {loaderContent}
        </div>
    );
};

export default Loader;
