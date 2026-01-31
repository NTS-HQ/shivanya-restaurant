const db = require('../config/database');

exports.getAllItems = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM menu_items ORDER BY category, name');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.addItem = async (req, res) => {
    const { name, description, price, category, image_url, is_available } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO menu_items (name, description, price, category, image_url, is_available) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, description, price, category, image_url, is_available]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url, is_available } = req.body;
    try {
        const result = await db.query(
            'UPDATE menu_items SET name=$1, description=$2, price=$3, category=$4, image_url=$5, is_available=$6 WHERE id=$7 RETURNING *',
            [name, description, price, category, image_url, is_available, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM menu_items WHERE id=$1', [id]);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
