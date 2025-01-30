// controllers/menuController.js
const Menu = require('../models/Menu');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res, next) => {
    console.log('getMenuItems');
    try {
        const filters = {};
        
        // Add category filter if provided
        if (req.query.category) {
            filters.category = req.query.category;
        }
        
        // Add availability filter if provided
        if (req.query.availability) {
            filters.availability = req.query.availability === 'true';
        }

        const menuItems = await Menu.find(filters).sort({ category: 1, name: 1 });
        res.json(menuItems);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItem = async (req, res, next) => {
    try {
        const menuItem = await Menu.findById(req.params.id);
        
        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }
        
        res.json(menuItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res, next) => {
    try {
        const { name, category, price, availability } = req.body;

        // Check if menu item with same name exists
        const menuItemExists = await Menu.findOne({ name });
        if (menuItemExists) {
            res.status(400);
            throw new Error('Menu item with this name already exists');
        }

        const menuItem = await Menu.create({
            name,
            category,
            price,
            availability: availability !== undefined ? availability : true
        });

        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        // // Check if updating name and if new name already exists
        // if (req.body?.name && req.body?.name !== menuItem.name) {
        //     const menuItemExists = await Menu.findOne({ name: req.body.name });
        //     if (menuItemExists) {
        //         res.status(400);
        //         throw new Error('Menu item with this name already exists');
        //     }
        // }

        const updatedMenuItem = await Menu.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body?.name || menuItem.name,
                category: req.body?.category || menuItem.category,
                price: req.body?.price || menuItem.price,
                availability: req.body?.availability !== undefined ? req.body.availability : menuItem.availability
            },
            { new: true, runValidators: true }
        );

        res.json(updatedMenuItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        await menuItem.deleteOne();
        res.json({ message: 'Menu item removed' });
    } catch (error) {
        next(error);
    }
};

// @desc    Update menu item availability
// @route   PATCH /api/menu/:id/availability
// @access  Private/Admin
const toggleAvailability = async (req, res, next) => {
    try {
        const menuItem = await Menu.findById(req.params.id);

        if (!menuItem) {
            res.status(404);
            throw new Error('Menu item not found');
        }

        menuItem.availability = !menuItem.availability;
        await menuItem.save();

        res.json(menuItem);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMenuItems,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
};