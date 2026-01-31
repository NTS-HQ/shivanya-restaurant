import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Utensils, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
    const { cart } = useCart();

    return (
        <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-primary/20 p-2 rounded-full">
                            <Utensils className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
                            Shivanya
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/menu" className="text-gray-700 hover:text-primary transition font-medium hidden md:block">
                            Menu
                        </Link>
                        <Link to="/track-order" className="text-gray-700 hover:text-primary transition font-medium hidden md:block">
                            Track Order
                        </Link>
                        <Link to="/cart" className="relative group">
                            <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-primary transition" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
