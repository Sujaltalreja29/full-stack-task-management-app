// src/context/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0
};

const cartReducer = (state, action) => {
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
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };

    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(item => item._id === action.payload);
      if (itemToRemove.quantity === 1) {
        const filteredItems = state.items.filter(item => item._id !== action.payload);
        return {
          ...state,
          items: filteredItems,
          total: calculateTotal(filteredItems)
        };
      }

      const updatedItems = state.items.map(item =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };

    case 'UPDATE_QUANTITY':
      const { itemId, quantity } = action.payload;
      if (quantity < 1) {
        const filteredItems = state.items.filter(item => item._id !== itemId);
        return {
          ...state,
          items: filteredItems,
          total: calculateTotal(filteredItems)
        };
      }

      const itemsWithUpdatedQuantity = state.items.map(item =>
        item._id === itemId ? { ...item, quantity } : item
      );
      return {
        ...state,
        items: itemsWithUpdatedQuantity,
        total: calculateTotal(itemsWithUpdatedQuantity)
      };

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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