const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/setup-admin', authController.setupAdmin);
router.post('/login', authController.login);
router.post('/create-waiter', authMiddleware, adminMiddleware, authController.createWaiter);

module.exports = router;
