// routes/menu.js
const express = require('express');
const router = express.Router();
const {
    getMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const { menuItemValidation, validate } = require('../middleware/validate');

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);

// Protected routes
router.use(protect);

// Admin routes
router.post('/', menuItemValidation, validate, createMenuItem);
router.put('/:id', menuItemValidation, validate, updateMenuItem);
router.delete('/:id', deleteMenuItem);
router.patch('/:id/availability', toggleAvailability);

module.exports = router;