import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { RestaurantProfile } from '../../types';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';

const LandingPage: React.FC = () => {
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);

    useEffect(() => {
        restaurantAPI.getProfile().then(res => setProfile(res.data)).catch(console.error);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
                        Taste the <span className="text-primary">Tradition</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Experience authentic flavors delivered to your table or doorstep.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/menu" className="bg-primary hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-full transition flex items-center">
                            Order Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link to="/track-order" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-full transition">
                            Track Order
                        </Link>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full -mt-10 z-20">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 transform hover:-translate-y-1 transition duration-300">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Opening Hours</h3>
                        <p className="text-gray-600">{profile?.opening_time || '10:00 AM'} - {profile?.closing_time || '10:00 PM'}</p>
                        <p className={`text-sm font-semibold ${profile?.is_open ? 'text-green-600' : 'text-red-500'}`}>
                            {profile?.is_open ? 'Currently Open' : 'Closed Now'}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 transform hover:-translate-y-1 transition duration-300">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Location</h3>
                        <p className="text-gray-600">{profile?.address || 'City Center'}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 transform hover:-translate-y-1 transition duration-300">
                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                        <Phone className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Contact Us</h3>
                        <p className="text-gray-600">{profile?.contact_number || '+91 98765 43210'}</p>
                        <p className="text-sm text-gray-500">{profile?.owner_name}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
