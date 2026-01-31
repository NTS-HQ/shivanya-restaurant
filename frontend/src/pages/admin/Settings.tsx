import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { restaurantAPI } from '../../services/api';
import { RestaurantProfile } from '../../types';
import { Save, Power } from 'lucide-react';

const Settings: React.FC = () => {
    const [profile, setProfile] = useState<RestaurantProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        restaurantAPI.getProfile().then(res => setProfile(res.data)).catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profile) {
            setProfile({ ...profile, [e.target.name]: e.target.value });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setLoading(true);
        try {
            await restaurantAPI.updateProfile(profile);
            alert('Settings saved successfully');
        } catch (err) {
            alert('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        if (!profile) return;
        try {
            const res = await restaurantAPI.toggleStatus(!profile.is_open);
            setProfile({ ...profile, is_open: res.data.is_open });
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (!profile) return <AdminLayout>Loading...</AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="flex justify-between items-center mb-8 border-b pb-8">
                    <div>
                        <h2 className="text-xl font-bold">Restaurant Status</h2>
                        <p className="text-gray-500 text-sm">Open or close your restaurant for orders</p>
                    </div>
                    <button
                        onClick={toggleStatus}
                        className={`px-6 py-3 rounded-xl font-bold flex items-center transition ${profile.is_open ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                        <Power className="mr-2 h-5 w-5" />
                        {profile.is_open ? 'Open' : 'Closed'}
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                            <input type="text" name="owner_name" value={profile.owner_name} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                            <input type="text" name="contact_number" value={profile.contact_number} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" name="address" value={profile.address} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                            <input type="text" name="opening_time" value={profile.opening_time} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                            <input type="text" name="closing_time" value={profile.closing_time} onChange={handleChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4">
                        <Save className="h-5 w-5" /> Save Changes
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Settings;
