import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/userService';
import { useUser } from '../contexts/UserContext';
import systemLogo from "../assets/systemLogo.jpg";

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser(); // Access setUser from UserContext

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData); // Log the form data before sending
        try {
            const response = await loginUser(formData.email, formData.password); // Assuming this returns user data on successful login
            console.log('Login successful:', response);

            // Set the user data in context, including name and role
            setUser({ name: response.userName || 'User', role: response.role || 'user' });

            // Redirect to Dashboard after successful login
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(
                error.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
                {/* Left Side - Logo */}
                <div className="relative hidden lg:block lg:w-1/2">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10 z-10" />
                    <img
                        src={systemLogo}
                        alt="Fashion"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
                    <div className="max-w-md mx-auto">
                        <div className="flex justify-center mb-8">
                            <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-pink-500" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-2">Sign In</h2>
                        <p className="text-gray-500 text-center mb-8">
                            Enter your email address and password to access admin panel.
                        </p>

                        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
