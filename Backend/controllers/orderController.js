const Order = require('../models/Order');
const Menu = require('../models/Menu');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const { items } = req.body;

        // Validate if items array is not empty
        if (!items || items.length === 0) {
            res.status(400);
            throw new Error('Order must contain at least one item');
        }

        // Calculate total amount and verify items exist
        let totalAmount = 0;
        for (let item of items) {
            const menuItem = await Menu.findById(item.menuItem);
            
            if (!menuItem) {
                res.status(400);
                throw new Error(`Menu item with id ${item.menuItem} not found`);
            }
            
            if (!menuItem.availability) {
                res.status(400);
                throw new Error(`${menuItem.name} is currently unavailable`);
            }

            totalAmount += menuItem.price * item.quantity;
        }

        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            status: 'Pending'
        });

        // Populate the menu items in the response
        await order.populate('items.menuItem');

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders of logged-in user
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
    try {
        if(!req.user.usertype) {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.menuItem')
            .sort('-createdAt');

        res.json(orders);
        } else {
            console.log("Admin user detected");
            const orders = await Order.find()
            .populate('items.menuItem')
            .sort('-createdAt');
            res.json(orders);
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.menuItem');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check if the order belongs to the logged-in user
        if (order.userId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to access this order');
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        
        if (!validStatuses.includes(status)) {
            res.status(400);
            throw new Error('Invalid status');
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};