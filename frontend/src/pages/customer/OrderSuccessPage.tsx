import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import confetti from 'canvas-confetti';

const OrderSuccessPage: React.FC = () => {
    const location = useLocation();
    const { orderId, total } = location.state || {}; // Simple state pass

    useEffect(() => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    if (!orderId) return <div className="text-center mt-20">Invalid Access</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-green-100 p-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Order Exceuted!</h1>
                    <p className="text-gray-500 mb-8">Thank you for dining with Shivanya.</p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-mono font-bold">#{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount to Pay</span>
                            <span className="font-bold text-primary-dark">₹{total}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Link to="/track-order" className="block w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                            Track Order
                        </Link>
                        <Link to="/" className="block w-full text-gray-500 hover:text-black py-2">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
