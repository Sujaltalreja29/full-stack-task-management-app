const { body, validationResult } = require('express-validator');

// Validation rules
const registerValidation = [
  body('username')
    .trim() 
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];

const menuItemValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Menu item name is required'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .isIn(['Appetizers', 'Main Course', 'Desserts', 'Beverages'])
    .withMessage('Invalid category')
];

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  menuItemValidation,
  validate
};