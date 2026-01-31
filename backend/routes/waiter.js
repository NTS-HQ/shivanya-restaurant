const express = require('express');
const router = express.Router();
const waiterController = require('../controllers/waiterController');
const { authMiddleware } = require('../middleware/authMiddleware');

// All waiter routes should be protected
router.post('/order', authMiddleware, waiterController.createOrder);

module.exports = router;
