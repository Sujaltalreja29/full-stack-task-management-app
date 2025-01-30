// src/pages/Menu.js
import React, { useState, useEffect } from 'react';
import * as menuService from '../services/menuService';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';

const Menu = () => {
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Appetizers',
    price: '',
    availability: true
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await menuService.getAllMenuItems();
      setMenuItems(data);
    } catch (err) {
      setError('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Items</h1>
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg shadow-md p-6 relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.category}</p>
                <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Appetizers">Appetizers</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Available</label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {selectedItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;