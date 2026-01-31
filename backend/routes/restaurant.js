const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', restaurantController.getProfile);
router.put('/', authMiddleware, adminMiddleware, restaurantController.updateProfile);
router.put('/status', authMiddleware, adminMiddleware, restaurantController.toggleStatus);

module.exports = router;
