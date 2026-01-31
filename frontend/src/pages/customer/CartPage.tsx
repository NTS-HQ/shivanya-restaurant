import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
    const { cart, updateQuantity, removeFromCart, totalAmount, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_mobile: '',
        order_type: 'dine-in', // Default
        table_number: '',
        pickup_time: '',
        delivery_address: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        try {
            const orderData = {
                ...formData,
                items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
            };

            const res = await ordersAPI.create(orderData);
            clearCart();
            navigate('/order-success', { state: { orderId: res.data.orderId, total: res.data.total_amount } });
        } catch (err) {
            console.error(err);
            alert('Failed to place order. Please try again.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/menu')} className="text-primary hover:underline">Browse Menu</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Cart Items */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                    <div className="space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <img
                                    src={item.image_url || 'https://via.placeholder.com/80'}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-500">₹{item.price}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 hover:bg-white rounded-md transition"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="font-medium text-sm w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 hover:bg-white rounded-md transition"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-400 hover:text-red-600 ml-2"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t font-bold flex justify-between text-lg">
                        <span>Total</span>
                        <span>₹{totalAmount}</span>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
                    <h2 className="text-xl font-bold mb-6">Checkout Details</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input required type="text" name="customer_name" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <input required type="tel" name="customer_mobile" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                            <select name="order_type" value={formData.order_type} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white">
                                <option value="dine-in">Dine-in</option>
                                <option value="takeaway">Takeaway</option>
                                <option value="delivery">Delivery</option>
                            </select>
                        </div>

                        {formData.order_type === 'dine-in' && (
                            <div className="fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                                <input required type="text" name="table_number" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                            </div>
                        )}

                        {formData.order_type === 'takeaway' && (
                            <div className="fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
                                <input required type="time" name="pickup_time" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
                            </div>
                        )}

                        {formData.order_type === 'delivery' && (
                            <div className="fade-in">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                <textarea required name="delivery_address" onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-24" />
                            </div>
                        )}

                        <button type="submit" className="w-full bg-primary hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4">
                            Place Order <ArrowRight className="h-5 w-5" />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default CartPage;
