import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Settings, LogOut, User } from 'lucide-react';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-primary">Shivanya</h2>
                    <p className="text-gray-400 text-sm">Management Panel</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/admin/dashboard') ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>

                    <Link to="/admin/orders" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/admin/orders') ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <ShoppingBag className="h-5 w-5" />
                        <span>Orders</span>
                    </Link>

                    <Link to="/admin/menu" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/admin/menu') ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <UtensilsCrossed className="h-5 w-5" />
                        <span>Menu</span>
                    </Link>

                    {user.role === 'admin' && (
                        <Link to="/admin/settings" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/admin/settings') ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                        </Link>
                    )}

                    <Link to="/admin/waiter" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive('/admin/waiter') ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-gray-800'}`}>
                        <User className="h-5 w-5" />
                        <span>Waiter Mode</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center mb-4 px-4">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                            {user.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 w-full text-red-400 hover:bg-gray-800 rounded-lg transition">
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
