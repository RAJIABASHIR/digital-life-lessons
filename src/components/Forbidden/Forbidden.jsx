import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Forbidden</h1>
            <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
            <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default Forbidden;
