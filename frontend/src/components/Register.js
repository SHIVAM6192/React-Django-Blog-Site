import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegisterSuccess, switchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axios.post('http://127.0.0.1:8000/api/register/', formData);
            alert("Registration Successful! Please login.");
            if (onRegisterSuccess) onRegisterSuccess(); // Switch to login view
        } catch (err) {
            console.error(err);
            // Django sends errors as an object (e.g. {username: ["Taken"], password: ["Too short"]})
            // We verify if response data exists to show specific error
            if (err.response && err.response.data) {
                // Grab the first error message found
                const firstErrorKey = Object.keys(err.response.data)[0];
                setError(`${firstErrorKey}: ${err.response.data[firstErrorKey][0]}`);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
                    {error}
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input name="first_name" type="text" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input name="last_name" type="text" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input name="username" type="text" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Min 8 chars, common passwords rejected" required />
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${isLoading ? 'bg-blue-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button type="button" onClick={switchToLogin} className="text-blue-600 font-semibold hover:underline">
                        Login here
                    </button>
                </p>
            </div>
        </form>
    );
};

export default Register;