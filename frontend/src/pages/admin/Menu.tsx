import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { menuAPI } from '../../services/api';
import { MenuItem } from '../../types';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Menu: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: '', image_url: '', is_available: true
    });

    const fetchMenu = async () => {
        try {
            const res = await menuAPI.getAll();
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await menuAPI.update(editingItem.id, formData);
            } else {
                await menuAPI.add(formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            setFormData({ name: '', description: '', price: '', category: '', image_url: '', is_available: true });
            fetchMenu();
        } catch (err) {
            console.error(err);
            alert('Failed to save item');
        }
    };

    const handleEdit = (item: MenuItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category,
            image_url: item.image_url,
            is_available: item.is_available
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await menuAPI.delete(id);
            fetchMenu();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Menu Management</h1>
                <button
                    onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', price: '', category: '', image_url: '', is_available: true }); setIsModalOpen(true); }}
                    className="bg-primary hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-bold flex items-center transition shadow-lg shadow-primary/20"
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            <img src={item.image_url || 'https://via.placeholder.com/300'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button onClick={() => handleEdit(item)} className="bg-white/90 p-2 rounded-full shadow hover:bg-white text-blue-600 transition"><Edit2 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(item.id)} className="bg-white/90 p-2 rounded-full shadow hover:bg-white text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">₹{item.price}</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                            <div className={`text-xs inline-block px-2 py-1 rounded-full ${item.is_available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {item.is_available ? 'Available' : 'Unavailable'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input required type="text" list="categories" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                                <datalist id="categories">
                                    {[...new Set(items.map(i => i.category))].map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.is_available} onChange={e => setFormData({ ...formData, is_available: e.target.checked })} className="w-5 h-5 accent-primary" />
                                <label className="text-sm font-medium">Available for Order</label>
                            </div>

                            <button type="submit" className="w-full bg-primary hover:bg-yellow-600 text-black font-bold py-3 rounded-xl transition mt-4">
                                {editingItem ? 'Update Item' : 'Create Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default Menu;
