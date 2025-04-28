import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2, Package, AlertCircle, ChevronDown, ChevronUp, CheckCircle, Clock, XCircle, Filter, Calendar, TruckIcon, ArrowUpDown } from 'lucide-react';
import * as orderService from '../services/orderService';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  
  const ORDER_STATUSES = ['Pending', 'Completed', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders(user._id);
        console.log("Fetched Orders:", response);
        // Sort orders by date (newest first)
        const sortedOrders = response.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setDisplayedOrders(sortedOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
    
    setDisplayedOrders(filtered);
  }, [orders, statusFilter, sortDirection]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await orderService.orderStatus(orderId, {status: newStatus});
      
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      // Show success message (toast notification would be ideal here)
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Completed: 'bg-green-100 text-green-800 border-green-200',
      Cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const price = item.menuItem?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Animation variants
  const orderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const detailsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 max-w-md w-full">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Unable to load orders</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">Track and manage all your orders in one place</p>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 w-5 h-5" />
            <span className="text-sm text-gray-600 font-medium">Filter:</span>
            <div className="inline-flex shadow-sm rounded-md">
              {['All', ...ORDER_STATUSES].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`
                    px-4 py-2 text-sm font-medium 
                    ${status === 'All' ? 'rounded-l-md' : ''}
                    ${status === 'Cancelled' ? 'rounded-r-md' : ''}
                    ${statusFilter === status 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                    }
                    border ${statusFilter === status ? 'border-orange-500' : 'border-gray-300'}
                    ${status !== 'All' ? 'border-l-0' : ''}
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={toggleSortDirection}
            className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4" />
            <span>Date</span>
            {sortDirection === 'desc' ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* Orders List */}
        <AnimatePresence>
          {displayedOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {statusFilter !== 'All' 
                  ? `You don't have any ${statusFilter.toLowerCase()} orders yet.` 
                  : "You haven't placed any orders yet. Explore our menu to get started!"}
              </p>
              <button
                onClick={() => window.location.href = '/menu'}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-lg shadow-sm transition-all duration-200"
              >
                Browse Menu
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {displayedOrders.map((order, index) => (
                <motion.div
                  key={order._id}
                  variants={orderVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Order Header */}
                  <div 
                    className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">
                          <Package className="w-5 h-5" />
                        </span>
                        <h3 className="font-semibold text-gray-900">
                          Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                        </h3>
                        {expandedOrderId === order._id ? (
                          <ChevronUp className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {user.usertype ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            Current: {order.status}
                          </span>
                          <select
                            className="text-sm px-3 py-1.5 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
                            disabled={updating}
                            value={order.status}
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent order expansion toggle
                              handleStatusUpdate(order._id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent order expansion toggle
                          >
                            {ORDER_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                Change to: {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      )}
                      <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Details (expandable) */}
                  <AnimatePresence>
                    {expandedOrderId === order._id && (
                      <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                          <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                                    {item.quantity}
                                  </span>
                                  <span className="text-gray-800">
                                    {item.menuItem?.name || "Item no longer available"}
                                  </span>
                                </div>
                                <span className="font-medium">
                                  ₹{((item.menuItem?.price || 0) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row justify-between gap-6">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Order Timeline</h4>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">
                                    <div className="h-4 w-4 rounded-full bg-green-500"></div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Order Placed</p>
                                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">
                                    <div className={`h-4 w-4 rounded-full ${
                                      order.status === 'Pending' ? 'bg-yellow-500' : 
                                      order.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      Status: {order.status}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {order.status === 'Pending' ? 'Your order is being processed' : 
                                       order.status === 'Completed' ? 'Your order has been delivered' : 
                                       'Your order was cancelled'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{calculateTotal(order.items).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span className="font-medium">₹{(calculateTotal(order.items) * 0.1).toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">
                                      {calculateTotal(order.items) > 500 ? (
                                        <span className="text-green-600">Free</span>
                                      ) : (
                                        "₹40.00"
                                      )}
                                    </span>
                                  </div>
                                  <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between">
                                      <span className="font-bold text-gray-900">Total</span>
                                      <span className="font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Status Indicator */}
                          {order.status === 'Pending' && (
                            <div className="mt-6 bg-orange-50 border border-orange-100 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <TruckIcon className="h-5 w-5 text-orange-500" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-orange-800">Delivery in Progress</h4>
                                  <p className="mt-1 text-sm text-orange-700">Your order is being prepared and will be delivered soon.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {order.status === 'Completed' && (
                            <div className="mt-6 bg-green-50 border border-green-100 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-green-800">Order Completed</h4>
                                  <p className="mt-1 text-sm text-green-700">Your order has been delivered successfully. Enjoy your meal!</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {order.status === 'Cancelled' && (
                            <div className="mt-6 bg-red-50 border border-red-100 rounded-lg p-4">
                              <div className="flex items-start">
                                <div className="flex-shrink-0">
                                  <XCircle className="h-5 w-5 text-red-500" />
                                </div>
                                <div className="ml-3">
                                  <h4 className="text-sm font-medium text-red-800">Order Cancelled</h4>
                                  <p className="mt-1 text-sm text-red-700">This order has been cancelled. If you have any questions, please contact support.</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {!user.usertype && order.status === 'Completed' && (
                            <div className="mt-6 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to reorder page or directly add items to cart
                                  const itemsToReorder = order.items.map(item => ({
                                    _id: item.menuItem?._id,
                                    name: item.menuItem?.name,
                                    price: item.menuItem?.price,
                                    quantity: item.quantity
                                  })).filter(item => item._id); // Filter out deleted items
                                  
                                  // Here you would implement reordering functionality
                                  alert('Reorder functionality would go here');
                                }}
                                className="px-4 py-2 bg-white border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 font-medium text-sm flex items-center gap-1 transition-colors duration-200"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reorder
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        
        {/* Pagination - could be added for many orders */}
        {displayedOrders.length > 10 && (
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-l-md">
                Previous
              </a>
              <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-orange-500 text-white">
                1
              </a>
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-r-md">
                Next
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;