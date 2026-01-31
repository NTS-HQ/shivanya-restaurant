-- Users table (Admins and Waiters)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'waiter')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurant Profile
CREATE TABLE IF NOT EXISTS restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'Shivanya Restaurant',
    owner_name VARCHAR(255),
    contact_number VARCHAR(50),
    address TEXT,
    is_open BOOLEAN DEFAULT true,
    opening_time VARCHAR(20),
    closing_time VARCHAR(20)
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_mobile VARCHAR(50) NOT NULL,
    order_type VARCHAR(50) CHECK (order_type IN ('cine-in', 'takeaway', 'delivery')) NOT NULL,
    table_number VARCHAR(50), -- for dine-in
    pickup_time VARCHAR(50), -- for takeaway
    delivery_address TEXT, -- for delivery
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('pending', 'accepted', 'rejected', 'prepared', 'delivered', 'cancelled')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    item_name VARCHAR(255) NOT NULL, -- Snapshot of name in case menu changes
    price DECIMAL(10, 2) NOT NULL, -- Snapshot of price
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL
);

-- Initial Restaurant Data (if not exists)
INSERT INTO restaurant (name, is_open) 
SELECT 'Shivanya Restaurant', true 
WHERE NOT EXISTS (SELECT 1 FROM restaurant);

-- Initial Admin User (Default: admin / admin123 - PASSWORD SHOULD BE HASHED IN PRODUCTION)
-- For this generator we will expect the user to set up the admin on first run or use a seed script if requested.
-- But the prompt asks for "Admin setup endpoint (one-time)", so we will handle that in code.
