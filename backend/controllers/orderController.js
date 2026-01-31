const db = require('../config/database');

exports.createOrder = async (req, res) => {
    const { customer_name, customer_mobile, order_type, table_number, pickup_time, delivery_address, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Calculate total amount
        let total_amount = 0;
        const orderItemsData = [];

        for (const item of items) {
            // Ideally we fetch price from DB to trust but for now we might trust frontend or re-fetch.
            // Let's re-fetch for security.
            const menuRes = await client.query('SELECT name, price FROM menu_items WHERE id = $1', [item.id]);
            if (menuRes.rows.length === 0) continue;

            const menuItem = menuRes.rows[0];
            const subtotal = menuItem.price * item.quantity;
            total_amount += subtotal;

            orderItemsData.push({
                menu_item_id: item.id,
                item_name: menuItem.name,
                price: menuItem.price,
                quantity: item.quantity,
                subtotal: subtotal
            });
        }

        const orderRes = await client.query(
            `INSERT INTO orders 
      (customer_name, customer_mobile, order_type, table_number, pickup_time, delivery_address, total_amount, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING id`,
            [customer_name, customer_mobile, order_type, table_number, pickup_time, delivery_address, total_amount]
        );

        const orderId = orderRes.rows[0].id;

        for (const itemData of orderItemsData) {
            await client.query(
                `INSERT INTO order_items (order_id, menu_item_id, item_name, price, quantity, subtotal)
             VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, itemData.menu_item_id, itemData.item_name, itemData.price, itemData.quantity, itemData.subtotal]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId, total_amount });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        client.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (orderRes.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const itemsRes = await db.query('SELECT * FROM order_items WHERE order_id = $1', [id]);

        res.json({ ...orderRes.rows[0], items: itemsRes.rows });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const validStatuses = ['pending', 'accepted', 'rejected', 'prepared', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const result = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalSalesRes = await db.query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'delivered'");
        const totalOrdersRes = await db.query("SELECT COUNT(*) as count FROM orders");
        const pendingOrdersRes = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
        const acceptedOrdersRes = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'accepted'");
        const deliveredOrdersRes = await db.query("SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'");

        res.json({
            totalSales: totalSalesRes.rows[0].total || 0,
            totalOrders: totalOrdersRes.rows[0].count,
            pendingOrders: pendingOrdersRes.rows[0].count,
            acceptedOrders: acceptedOrdersRes.rows[0].count,
            deliveredOrders: deliveredOrdersRes.rows[0].count
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
