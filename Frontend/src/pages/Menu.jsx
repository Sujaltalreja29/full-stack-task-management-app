import React, { useState, useEffect } from 'react';
import * as menuService from '../services/menuService';
import { PlusIcon, PencilIcon, TrashIcon, ShoppingCartIcon, MinusIcon, SearchIcon, FilterIcon, XIcon, ChevronDownIcon, TagIcon, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
  const [userRole, setUserRole] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [activeCategory, setActiveCategory] = useState('All');
  const { 
    items, 
    addToCart, 
    removeFromCart, 
    getItemQuantity,
    getCartTotal,
  } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizers',
    price: '',
    availability: true
  });
  const navigate = useNavigate();
  const CATEGORIES = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages'];
  
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user.usertype);
    fetchMenuItems();
  }, []);
  
  const fetchMenuItems = async () => {
    try {
      const data = await menuService.getAllMenuItems();
      setMenuItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  // Search and Filter Function
  const applyFilters = () => {
    let result = menuItems;

    // Search filter
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (from tabs)
    if (activeCategory !== 'All') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Category filter (from checkboxes in filter panel)
    if (selectedCategories.length > 0) {
      result = result.filter(item => 
        selectedCategories.includes(item.category)
      );
    }

    // Price range filter
    result = result.filter(item => 
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    setFilteredItems(result);
  };

  // Apply filters whenever search or filter conditions change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategories, priceRange, menuItems, activeCategory]);

  // Category toggle handler
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Existing CRUD handlers remain the same
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedItem) {
        await menuService.updateMenuItem(selectedItem._id, formData);
      } else {
        await menuService.createMenuItem(formData);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      setFormData({
        name: '',
        category: 'Appetizers',
        price: '',
        availability: true
      });
      fetchMenuItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      availability: item.availability
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await menuService.deleteMenuItem(id);
        fetchMenuItems();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Food item card variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu</h1>
            <p className="text-gray-600">Discover our delightful range of culinary offerings</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 md:mt-0 flex items-center"
          >
            {!userRole && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all duration-200 mr-3"
              >
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-100 text-orange-600">
                  <ShoppingCartIcon className="w-3.5 h-3.5" />
                </span>
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            )}
            
            {userRole && (
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setFormData({
                    name: '',
                    category: 'Appetizers',
                    price: '',
                    availability: true
                  });
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2.5 px-5 rounded-xl shadow-md transition-all duration-200"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            )}
          </motion.div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
          >
            <div className="flex items-center">
              <XIcon className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Search and Category Tabs */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Search */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon className="w-5 h-5" />
              </div>
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border ${
                isFilterOpen || selectedCategories.length > 0 
                  ? 'bg-orange-50 border-orange-200 text-orange-600' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <FilterIcon className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {selectedCategories.length > 0 && (
                <span className="ml-1 flex items-center justify-center h-5 w-5 bg-orange-500 text-white text-xs rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </motion.div>

          {/* Category Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex overflow-x-auto pb-2 -mx-1 hide-scrollbar"
          >
            {CATEGORIES.map((category, index) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap px-5 py-2.5 mx-1 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeCategory === category 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
        
        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TagIcon className="w-4 h-4 mr-2 text-orange-500" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter(cat => cat !== 'All').map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <TagIcon className="w-4 h-4 mr-2 text-orange-500" />
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-full">
                        <label className="block text-sm text-gray-600 mb-1">Min Price (₹)</label>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-sm text-gray-600 mb-1">Max Price (₹)</label>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedCategories([]);
                          setPriceRange({ min: 0, max: 1000 });
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200"
          >
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We couldn't find any menu items that match your search and filters. Try adjusting your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategories([]);
                setPriceRange({ min: 0, max: 1000 });
                setActiveCategory('All');
              }}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                variants={cardVariants}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors duration-200">{item.name}</h3>
                      <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                    </div>
                    {userRole && (
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-gray-400 hover:text-orange-500 p-1.5 rounded-full hover:bg-orange-50 transition-colors duration-200"
                        >
                          <PencilIcon className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200"
                        >
                          <TrashIcon className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.availability 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.availability ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Available
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Unavailable
                        </>
                      )}
                    </span>
                  </div>
                  
                  {!userRole && item.availability && (
                    <div className="mt-4">
                      {getItemQuantity(item._id) > 0 ? (
                        <div className="flex items-center justify-between p-1 bg-gray-50 rounded-lg">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-orange-500 hover:bg-orange-50 border border-gray-200 shadow-sm transition-colors duration-200"
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-gray-800">{getItemQuantity(item._id)}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-orange-500 hover:bg-orange-50 border border-gray-200 shadow-sm transition-colors duration-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                        >
                          <ShoppingCartIcon className="w-4 h-4" />
                          Add to Cart
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Admin Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  {selectedItem ? (
                    <>
                      <PencilIcon className="w-5 h-5 mr-2 text-orange-500" />
                      Edit Menu Item
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5 mr-2 text-orange-500" />
                      Add New Menu Item
                    </>
                  )}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Enter item name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="appearance-none w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-white transition-colors duration-200"
                      >
                        <option value="Appetizers">Appetizers</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <ChevronDownIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="flex items-center bg-gray-50 p-3 rounded-xl">
                    <input
                      type="checkbox"
                      id="availability"
                      name="availability"
                      checked={formData.availability}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="availability" className="ml-2 flex flex-col cursor-pointer">
                      <span className="text-sm font-medium text-gray-900">Available for Order</span>
                      <span className="text-xs text-gray-500">Uncheck if item is out of stock</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium shadow-sm transition-all duration-200"
                    >
                      {selectedItem ? 'Update Item' : 'Add Item'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

                {/* Cart Modal */}
                <AnimatePresence>
          {isCartOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 px-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center">
                      <ShoppingCartIcon className="w-6 h-6 mr-2" />
                      Your Cart
                    </h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-white hover:text-orange-100 rounded-full p-1 transition-colors duration-200"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-orange-100 text-sm mt-1">
                    {items.length === 0 ? "Your cart is empty" : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`}
                  </p>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto p-6">
                  {items.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                        <ShoppingCartIcon className="w-8 h-8 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6">Add items from the menu to get started</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium shadow-sm transition-all duration-200"
                      >
                        Browse Menu
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(item => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex-grow">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-gray-500">{item.category}</p>
                              <p className="text-sm font-semibold text-gray-900">₹{item.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-orange-500 hover:bg-orange-100 rounded-md p-1 transition-colors duration-200"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="mx-2 font-semibold text-gray-800 min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              className="text-orange-500 hover:bg-orange-100 rounded-md p-1 transition-colors duration-200"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {items.length > 0 && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-800">₹{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="font-medium text-gray-800">₹{(getCartTotal() * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-6 text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">₹{(getCartTotal() * 1.05).toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/order');
                        setIsCartOpen(false);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                    >
                      <span>Proceed to Checkout</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Add to your CSS for the scrollbar hiding */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Menu;
        