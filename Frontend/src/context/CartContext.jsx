import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'shopping-cart';

// Load initial state from localStorage or use default
const loadInitialState = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : {
      items: [],
      total: 0
    };
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {
      items: [],
      total: 0
    };
  }
};

const cartReducer = (state, action) => {
  let newState;
  
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );

      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        newState = {
          ...state,
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
      break;

    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item._id === action.payload);
      if (itemToRemove.quantity === 1) {
        const filteredItems = state.items.filter(item => item._id !== action.payload);
        newState = {
          ...state,
          items: filteredItems,
          total: calculateTotal(filteredItems)
        };
      } else {
        const updatedItems = state.items.map(item =>
          item._id === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      break;

    case 'UPDATE_QUANTITY':
      const { itemId, quantity } = action.payload;
      if (quantity < 1) {
        const filteredItems = state.items.filter(item => item._id !== itemId);
        newState = {
          ...state,
          items: filteredItems,
          total: calculateTotal(filteredItems)
        };
      } else {
        const itemsWithUpdatedQuantity = state.items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        );
        newState = {
          ...state,
          items: itemsWithUpdatedQuantity,
          total: calculateTotal(itemsWithUpdatedQuantity)
        };
      }
      break;

    case 'CLEAR_CART':
      newState = {
        items: [],
        total: 0
      };
      break;

    default:
      return state;
  }

  // Save to localStorage after every state change
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
  return newState;
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);

  // Optional: Sync cart across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CART_STORAGE_KEY) {
        const newState = JSON.parse(e.newValue);
        if (newState) {
          dispatch({ type: 'SYNC_CART', payload: newState });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.total;
  };

  const getItemQuantity = (itemId) => {
    const item = state.items.find(item => item._id === itemId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    total: state.total,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};