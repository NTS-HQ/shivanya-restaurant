import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { KeyRound, Mail } from 'lucide-react';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await authAPI.login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 bg-[url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-blend-overlay">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
                <h2 className="text-3xl font-bold text-center text-white mb-8">Admin Portal</h2>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/50">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition active:scale-95 shadow-lg shadow-primary/20">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
