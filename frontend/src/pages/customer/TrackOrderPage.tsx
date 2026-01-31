import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';
import { Search, Loader2 } from 'lucide-react';

const TrackOrderPage: React.FC = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setError('');
        try {
            const res = await ordersAPI.track(parseInt(orderId));
            setOrder(res.data);
        } catch (err) {
            setError('Order not found. Please check ID.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'prepared': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-2xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>

                <form onSubmit={handleTrack} className="flex gap-4 mb-10">
                    <input
                        type="number"
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        className="flex-1 p-4 rounded-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button type="submit" disabled={loading} className="bg-primary hover:bg-yellow-600 px-8 rounded-xl font-bold flex items-center transition disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    </button>
                </form>

                {error && (
                    <div className="text-center text-red-500 bg-red-50 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {order && (
                    <div className="bg-white p-8 rounded-3xl shadow-lg fade-in">
                        <div className="flex justify-between items-start mb-6 border-b pb-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Order #{order.id}</h2>
                                <p className="text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            <span className={`px-4 py-2 rounded-full font-bold uppercase text-sm ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {order.items?.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.quantity}x {item.item_name}</span>
                                    <span className="font-semibold">₹{item.subtotal}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t flex justify-between items-center text-xl font-bold">
                            <span>Total Amount</span>
                            <span className="text-primary-dark">₹{order.total_amount}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
