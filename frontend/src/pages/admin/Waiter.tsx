import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { menuAPI, waiterAPI } from '../../services/api';
import { MenuItem, CartItem } from '../../types';
import { Plus, Minus, Trash2, Send } from 'lucide-react';

const Waiter: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [category, setCategory] = useState('All');
    const [formData, setFormData] = useState({ customer_name: '', table_number: '', order_type: 'dine-in' });

    useEffect(() => {
        menuAPI.getAll().then(res => setItems(res.data));
    }, []);

    const addToCart = (item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity < 1) setCart(prev => prev.filter(i => i.id !== id));
        else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0 || !formData.customer_name) return alert('Name and items required');
        try {
            await waiterAPI.placeOrder({
                ...formData,
                items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
                customer_mobile: 'WaiterManual'
            });
            alert('Order Placed');
            setCart([]);
            setFormData({ customer_name: '', table_number: '', order_type: 'dine-in' });
        } catch {
            alert('Error placing order');
        }
    };

    return (
        <AdminLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6">
                {/* Left: Menu */}
                <div className="flex-1 flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">New Order (Waiter Mode)</h1>
                    <div className="flex gap-2 overflow-x-auto mb-4 pb-2">
                        {['All', ...new Set(items.map(i => i.category))].map(c => (
                            <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg whitespace-nowrap ${category === c ? 'bg-black text-white' : 'bg-white border'}`}>{c}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 overflow-y-auto pr-2">
                        {items.filter(i => category === 'All' || i.category === category).map(item => (
                            <button key={item.id} onClick={() => addToCart(item)} className="bg-white p-4 rounded-xl shadow-sm border hover:border-primary text-left transition text-sm">
                                <div className="font-bold">{item.name}</div>
                                <div className="text-gray-500">₹{item.price}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="w-96 bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full border border-gray-100">
                    <h2 className="font-bold text-xl mb-4">Current Order</h2>

                    <div className="space-y-3 mb-4">
                        <input placeholder="Customer Name" className="w-full p-2 border rounded" value={formData.customer_name} onChange={e => setFormData({ ...formData, customer_name: e.target.value })} />
                        <select className="w-full p-2 border rounded" value={formData.order_type} onChange={e => setFormData({ ...formData, order_type: e.target.value })}>
                            <option value="dine-in">Dine-in</option>
                            <option value="takeaway">Takeaway</option>
                        </select>
                        {formData.order_type === 'dine-in' && (
                            <input placeholder="Table Number" className="w-full p-2 border rounded" value={formData.table_number} onChange={e => setFormData({ ...formData, table_number: e.target.value })} />
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-gray-500">₹{item.price * item.quantity}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 bg-gray-100 rounded"><Minus size={14} /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 bg-gray-100 rounded"><Plus size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold mb-4">
                            <span>Total</span>
                            <span>₹{cart.reduce((a, b) => a + (b.price * b.quantity), 0)}</span>
                        </div>
                        <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800">
                            <Send size={18} /> Place Order
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Waiter;
