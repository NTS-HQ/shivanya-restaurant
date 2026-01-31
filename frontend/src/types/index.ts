export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    is_available: boolean;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'waiter';
}

export interface Order {
    id: number;
    customer_name: string;
    customer_mobile: string;
    order_type: 'dine-in' | 'takeaway' | 'delivery';
    table_number?: string;
    pickup_time?: string;
    delivery_address?: string;
    total_amount: number;
    status: 'pending' | 'accepted' | 'rejected' | 'prepared' | 'delivered' | 'cancelled';
    created_at: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    item_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface RestaurantProfile {
    name: string;
    owner_name: string;
    contact_number: string;
    address: string;
    is_open: boolean;
    opening_time: string;
    closing_time: string;
}
