import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);
export const register = async (username, password, usertype) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      username,
      password,
      usertype,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const login = async (username, password) => {
  try {
    console.log("login");
    console.log(API_URL);
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};