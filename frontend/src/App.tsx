import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderSuccessPage from './pages/customer/OrderSuccessPage';
import TrackOrderPage from './pages/customer/TrackOrderPage';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Menu from './pages/admin/Menu';
import Settings from './pages/admin/Settings';
import Waiter from './pages/admin/Waiter';
import Setup from './pages/admin/Setup';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
    return (
        <CartProvider>
            <Router>
                <Routes>
                    {/* Customer Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/track-order" element={<TrackOrderPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin/setup" element={<Setup />} />
                    <Route path="/admin/login" element={<Login />} />

                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/orders" element={
                        <ProtectedRoute>
                            <Orders />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/menu" element={
                        <ProtectedRoute>
                            <Menu />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/settings" element={
                        <ProtectedRoute role="admin">
                            <Settings />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/waiter" element={
                        <ProtectedRoute>
                            <Waiter />
                        </ProtectedRoute>
                    } />

                </Routes>
            </Router>
        </CartProvider>
    );
};

export default App;
