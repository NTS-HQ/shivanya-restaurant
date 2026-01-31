import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    setupAdmin: (data: any) => api.post('/auth/setup-admin', data),
};

export const restaurantAPI = {
    getProfile: () => api.get('/restaurant'),
    updateProfile: (data: any) => api.put('/restaurant', data),
    toggleStatus: (isOpen: boolean) => api.put('/restaurant/status', { is_open: isOpen }),
};

export const menuAPI = {
    getAll: () => api.get('/menu'),
    add: (data: any) => api.post('/menu', data),
    update: (id: number, data: any) => api.put(`/menu/${id}`, data),
    delete: (id: number) => api.delete(`/menu/${id}`),
};

export const ordersAPI = {
    create: (data: any) => api.post('/orders', data),
    track: (id: number) => api.get(`/orders/${id}`),
    getAll: () => api.get('/orders'),
    updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
    getStats: () => api.get('/orders/stats/summary'),
};

export const waiterAPI = {
    placeOrder: (data: any) => api.post('/waiter/order', data),
};

export default api;
