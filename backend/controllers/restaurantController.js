const db = require('../config/database');

exports.getProfile = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM restaurant LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Restaurant profile not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, owner_name, contact_number, address, opening_time, closing_time } = req.body;
    try {
        const result = await db.query(
            `UPDATE restaurant SET 
       name = $1, owner_name = $2, contact_number = $3, address = $4, opening_time = $5, closing_time = $6
       WHERE id = (SELECT id FROM restaurant LIMIT 1) RETURNING *`,
            [name, owner_name, contact_number, address, opening_time, closing_time]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.toggleStatus = async (req, res) => {
    const { is_open } = req.body;
    try {
        const result = await db.query(
            'UPDATE restaurant SET is_open = $1 WHERE id = (SELECT id FROM restaurant LIMIT 1) RETURNING *',
            [is_open]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
