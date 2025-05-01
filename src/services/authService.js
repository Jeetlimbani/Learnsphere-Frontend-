import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth/';

// Register function
export const register = (data) => axios.post(`${API_URL}register`, data, { withCredentials: true });

// Login function
export const login = (data) => axios.post(`${API_URL}login`, data, { withCredentials: true });

// Fetch user data
export const fetchUserData = async () => {
  const response = await axios.get(`${API_URL}user`, { withCredentials: true }); // Automatically include cookies
  return response.data;
};
