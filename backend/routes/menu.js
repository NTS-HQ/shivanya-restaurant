const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', menuController.getAllItems);
router.post('/', authMiddleware, adminMiddleware, menuController.addItem);
router.put('/:id', authMiddleware, adminMiddleware, menuController.updateItem);
router.delete('/:id', authMiddleware, adminMiddleware, menuController.deleteItem);

module.exports = router;
