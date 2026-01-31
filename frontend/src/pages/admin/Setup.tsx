import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Setup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authAPI.setupAdmin(formData);
            alert('Admin created! Please login.');
            navigate('/admin/login');
        } catch (err) {
            alert('Setup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Initial Setup</h2>
                <input required placeholder="Admin Name" className="w-full p-3 border rounded-lg mb-4" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input required type="email" placeholder="Email" className="w-full p-3 border rounded-lg mb-4" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <input required type="password" placeholder="Password" className="w-full p-3 border rounded-lg mb-6" onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <button className="w-full bg-primary text-black font-bold py-3 rounded-xl">Create Admin</button>
            </form>
        </div>
    );
};

export default Setup;
