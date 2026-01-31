const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', orderController.createOrder); // Public
router.get('/:id', orderController.getOrderById); // Public (for tracking)

// Admin/Waiter Routes
router.get('/', authMiddleware, orderController.getOrders);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.get('/stats/summary', authMiddleware, orderController.getStats);

module.exports = router;
