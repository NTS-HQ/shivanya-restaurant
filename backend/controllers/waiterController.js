const db = require('../config/database');

// Waiter can manually place orders.
// This is similar to customer order but we might want to mark it as 'accepted' immediately or just pending.
// For now, we follow the same flow as customer.

exports.createOrder = async (req, res) => {
    const { customer_name, customer_mobile, order_type, table_number, items } = req.body;

    // Waiter orders might default some fields or require less validation on address (since it's manual).
    // Assuming Waiter orders are mostly Dine-in or Takeaway handled on spot.

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in order' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        let total_amount = 0;
        const orderItemsData = [];

        for (const item of items) {
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
      (customer_name, customer_mobile, order_type, table_number, total_amount, status) 
      VALUES ($1, $2, $3, $4, $5, 'accepted') RETURNING id`, // Auto-accept waiter orders
            [customer_name, customer_mobile || 'Walk-in', order_type, table_number, total_amount]
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
        res.status(201).json({ message: 'Order placed by waiter', orderId, total_amount });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Server error', error: err.message });
    } finally {
        client.release();
    }
};
