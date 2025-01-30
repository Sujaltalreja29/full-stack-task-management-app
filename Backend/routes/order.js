const express = require('express');
const { orderValidation, validate } = require('../middleware/validate');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Order routes
router.post('/', orderValidation, validate, createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
