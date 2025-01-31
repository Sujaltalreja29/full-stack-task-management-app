import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const authAxios = axios.create();

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllMenuItems = async () => {
  const response = await authAxios.get(`${API_URL}/api/menu/`);
  return response.data;
};

export const createMenuItem = async (menuData) => {
  const response = await authAxios.post(`${API_URL}/api/menu/`, menuData);
  return response.data;
};

export const updateMenuItem = async (id, menuData) => {
  const response = await authAxios.put(`${API_URL}/api/menu/${id}`, menuData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await authAxios.delete(`${API_URL}/api/menu/${id}`);
  return response.data;
};