import React, { useEffect, useState } from 'react';
import { menuAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { Plus } from 'lucide-react';

const MenuPage: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const { addToCart } = useCart();

    useEffect(() => {
        menuAPI.getAll().then(res => {
            setItems(res.data);
            const uniqueCategories = ['All', ...new Set(res.data.map((i: MenuItem) => i.category))];
            setCategories(uniqueCategories as string[]);
        });
    }, []);

    const filteredItems = activeCategory === 'All'
        ? items.filter(i => i.is_available)
        : items.filter(i => i.category === activeCategory && i.is_available);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

                {/* Categories */}
                <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap transition font-medium ${activeCategory === cat
                                    ? 'bg-primary text-black shadow-lg shadow-primary/30'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                    alt={item.name}
                                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                />
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                                    <span className="bg-primary/10 text-primary-dark font-bold px-2 py-1 rounded text-sm">
                                        ₹{item.price}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="w-full bg-gray-900 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition active:scale-95"
                                >
                                    <Plus className="h-4 w-4" /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
