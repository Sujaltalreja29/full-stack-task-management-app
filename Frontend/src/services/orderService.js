import axios from 'axios';

const API_URL = import.meta.env.API_URL || 'http://localhost:5000/api';

// Create axios instance with auth header
const authAxios = axios.create();

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllOrders = async () => {
  const response = await authAxios.get(`${API_URL}/order/`);
  console.log(response.data);
  return response.data;
};

export const createOrder = async (orderData) => {
  const response = await authAxios.post(`${API_URL}/order/`, orderData);
  return response.data;
};

export const orderStatus = async (orderid,status) => {
  console.log(orderid);
  const response = await authAxios.put(`${API_URL}/order/${orderid}/status`,status);
  console.log(response.data);
  return response.data;
};
