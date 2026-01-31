import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { ordersAPI } from '../../services/api';
import { Order } from '../../types';
import { Check, X, Truck, ChefHat, RefreshCw } from 'lucide-react';

const Orders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filter, setFilter] = useState('All');

    const fetchOrders = async () => {
        try {
            const res = await ordersAPI.getAll();
            setOrders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const handleStatusUpdate = async (id: number, status: string) => {
        try {
            await ordersAPI.updateStatus(id, status);
            fetchOrders();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'prepared': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'rejected': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <button onClick={fetchOrders} className="p-2 hover:bg-gray-200 rounded-full transition"><RefreshCw className="h-5 w-5" /></button>
            </div>

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'pending', 'accepted', 'prepared', 'delivered', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${filter === status ? 'bg-primary text-black' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center text-gray-400 py-20">No orders found</div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">#{order.id} <span className="text-gray-500 font-normal ml-2">by {order.customer_name}</span></h3>
                                    <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                                    <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wide">{order.order_type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl mb-1">₹{order.total_amount}</p>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end border-t pt-4 mt-4">
                                {order.status === 'pending' && (
                                    <>
                                        <button onClick={() => handleStatusUpdate(order.id, 'accepted')} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-bold">
                                            <Check className="h-4 w-4 mr-2" /> Accept
                                        </button>
                                        <button onClick={() => handleStatusUpdate(order.id, 'rejected')} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-bold">
                                            <X className="h-4 w-4 mr-2" /> Reject
                                        </button>
                                    </>
                                )}
                                {order.status === 'accepted' && (
                                    <button onClick={() => handleStatusUpdate(order.id, 'prepared')} className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm font-bold">
                                        <ChefHat className="h-4 w-4 mr-2" /> Mark Prepared
                                    </button>
                                )}
                                {order.status === 'prepared' && (
                                    <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-bold">
                                        <Truck className="h-4 w-4 mr-2" /> Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
};

export default Orders;
