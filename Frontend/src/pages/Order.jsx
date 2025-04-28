import React, { useState, useEffect } from 'react';
import { TrashIcon, CreditCardIcon, MapPinIcon, PhoneIcon, UserIcon, ChevronRightIcon, TruckIcon, ShoppingBagIcon, AlertCircleIcon, CheckCircleIcon, RefreshCcwIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import * as orderService from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';

const OrderPage = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart
  } = useCart();
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check if cart is empty
    if (items.length === 0 && !orderPlaced) {
      navigate('/menu');
    }
  }, [items, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // Assuming 10% tax
  };

  const calculateDeliveryFee = () => {
    return calculateSubtotal() > 500 ? 0 : 40; // Free delivery over ₹500
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateDeliveryFee();
  };

  const nextStep = (e) => {
    e.preventDefault();
    setActiveStep(2);
    window.scrollTo(0, 0);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedItems = items.map(item => ({ menuItem: item._id, quantity: item.quantity }));
      await orderService.createOrder({ items: updatedItems });
      
      setOrderPlaced(true);
      // Clear cart after successful order
      clearCart();
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6"
      >
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-1">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-8 px-6 rounded-xl text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto bg-white text-green-500 h-16 w-16 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircleIcon className="h-8 w-8" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-green-100">
                  Your delicious food is being prepared.
                </p>
              </div>
              
              <div className="p-6 text-center">
                <p className="text-gray-700 mb-6">
                  Thank you for your order. You can track the status of your order in the order history.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/history')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center"
                  >
                    <TruckIcon className="w-4 h-4 mr-2" />
                    Track Order
                  </button>
                  <button
                    onClick={() => navigate('/menu')}
                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingBagIcon className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
          <p className="text-gray-600 mb-8">Just a few more steps to enjoy your meal</p>
          
          {/* Progress Steps */}
          <div className="mb-8 hidden sm:block">
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${activeStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <ShoppingBagIcon className="h-5 w-5" />
              </div>
              <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center h-10 w-10 rounded-full ${activeStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <CreditCardIcon className="h-5 w-5" />
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200"></div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600">
                <CheckCircleIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={activeStep >= 1 ? "text-orange-600 font-medium" : "text-gray-600"}>Review Order</span>
              <span className={activeStep >= 2 ? "text-orange-600 font-medium" : "text-gray-600"}>Payment</span>
              <span className="text-gray-600">Confirmation</span>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start"
          >
            <AlertCircleIcon className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">There was an error with your order</p>
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {activeStep === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Order Summary Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {items.map(item => (
                      <motion.div 
                        key={item._id} 
                        variants={itemVariants}
                        className="px-6 py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-red-50 transition-colors duration-200"
                            aria-label="Remove item"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50">
                    <button
                      onClick={() => navigate('/menu')}
                      className="text-orange-600 hover:text-orange-700 font-medium flex items-center text-sm"
                    >
                      <RefreshCcwIcon className="w-4 h-4 mr-1" />
                      Add more items
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary Card */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">
                          {calculateDeliveryFee() === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `₹${calculateDeliveryFee().toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-orange-600">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        {calculateDeliveryFee() === 0 && (
                          <p className="text-green-600 text-xs mt-1">You got free delivery!</p>
                        )}
                      </div>
                    </div>
                    
                    <form onSubmit={nextStep}>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 px-5 rounded-xl shadow-sm transition-all duration-200"
                      >
                        Continue to Payment
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeStep === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Customer Information Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmitOrder} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Delivery Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <UserIcon className="w-4 h-4 mr-1 text-gray-500" />
                            Full Name
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-1 text-gray-500" />
                            Phone Number
                          </span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
                            Delivery Address
                          </span>
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          rows="3"
                          placeholder="Enter your complete delivery address"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center">
                            <CreditCardIcon className="w-4 h-4 mr-1 text-gray-500" />
                            Payment Method
                          </span>
                        </label>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div 
                            className={`border rounded-xl p-4 cursor-pointer ${
                              formData.paymentMethod === 'card' 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({...prev, paymentMethod: 'card'}))}
                          >
                            <div className="flex items-center">
                              <input
                                id="card-payment"
                                name="paymentMethod"
                                type="radio"
                                checked={formData.paymentMethod === 'card'}
                                onChange={() => setFormData(prev => ({...prev, paymentMethod: 'card'}))}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                              />
                              <label htmlFor="card-payment" className="ml-3 flex items-center cursor-pointer">
                                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                  </svg>
                                </span>
                                <div>
                                  <span className="block font-medium text-gray-900">Credit/Debit Card</span>
                                  <span className="block text-gray-500 text-sm">Pay securely with your card</span>
                                </div>
                              </label>
                            </div>
                          </div>
                          
                          <div 
                            className={`border rounded-xl p-4 cursor-pointer ${
                              formData.paymentMethod === 'cash' 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setFormData(prev => ({...prev, paymentMethod: 'cash'}))}
                          >
                            <div className="flex items-center">
                              <input
                                id="cash-payment"
                                name="paymentMethod"
                                type="radio"
                                checked={formData.paymentMethod === 'cash'}
                                onChange={() => setFormData(prev => ({...prev, paymentMethod: 'cash'}))}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                              />
                              <label htmlFor="cash-payment" className="ml-3 flex items-center cursor-pointer">
                                <span className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 text-green-600 mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                  </svg>
                                </span>
                                <div>
                                  <span className="block font-medium text-gray-900">Cash on Delivery</span>
                                  <span className="block text-gray-500 text-sm">Pay when your order arrives</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => setActiveStep(1)}
                          className="text-gray-600 hover:text-gray-900 font-medium mr-4"
                        >
                          Back to Cart
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing Order...
                            </>
                          ) : (
                            <>
                              Place Order
                              <CheckCircleIcon className="ml-2 -mr-1 h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Order Summary Card (Right Side) */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-20">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {items.map(item => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name} <span className="text-gray-400">x{item.quantity}</span>
                          </span>
                          <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (10%)</span>
                        <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">
                          {calculateDeliveryFee() === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `₹${calculateDeliveryFee().toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="text-xl font-bold text-orange-600">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        {calculateDeliveryFee() === 0 && (
                          <p className="text-green-600 text-xs mt-1">You got free delivery!</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <TruckIcon className="h-5 w-5 text-orange-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-orange-800">Estimated Delivery Time</h4>
                          <p className="mt-1 text-sm text-orange-700">30-45 minutes after order confirmation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderPage;