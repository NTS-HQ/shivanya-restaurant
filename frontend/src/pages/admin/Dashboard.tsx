import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { ordersAPI } from '../../services/api';
import { Banknote, ShoppingBag, Clock, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    const fetchStats = async () => {
        try {
            const res = await ordersAPI.getStats();
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    if (!stats) return <AdminLayout><div className="flex justify-center mt-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div></AdminLayout>;

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                        <Banknote className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-800">₹{stats.totalSales}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Pending</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-600">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Delivered</p>
                        <p className="text-2xl font-bold text-gray-800">{stats.deliveredOrders}</p>
                    </div>
                </div>
            </div>

            {/* Could add Chart or Recent Orders here */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Placeholders for future widgets */}
                    <div className="border border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-gray-400">
                        Sales Chart (Future)
                    </div>
                    <div className="border border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-gray-400">
                        Top Selling Items (Future)
                    </div>
                    <div className="border border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-gray-400">
                        Customer Insights (Future)
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
};

export default Dashboard;
