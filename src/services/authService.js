import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/auth/';

// Configure axios defaults for auth requests
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add authorization header for all requests when token exists
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register function
export const register = (data) => authAxios.post('register', data);

// Login function
export const login = (data) => authAxios.post('login', data);

// Fetch user data
export const fetchUserData = async () => {
  try {
    const response = await authAxios.get('user');
    
    // Check if we have data and return it in a consistent format
    if (response && response.data) {
      return response.data;
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('fetchUserData error:', error);
    // If token expired or is invalid, clear it
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};

// Google login
export const googleLogin = (credential) => {
  return authAxios.post('google-login', { credential });
};

// Complete Google signup with role selection
export const completeGoogleSignup = (googleUser, role) => {
  return authAxios.post('google-register', { googleUser, role });
};

// Logout
export const logout = async () => {
  try {
    await authAxios.post('logout');
  } catch (error) {
    console.error('Logout API error:', error);
    // Proceed with local logout even if API call fails
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) return null;
  
  try {
    const response = await authAxios.get('me');
    return response.data.user;
  } catch (error) {
    // If token is invalid, clear it
    if (error.response && error.response.status === 401) {
      logout();
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export default {
  login,
  register,
  googleLogin,
  logout,
  completeGoogleSignup,
  getCurrentUser,
  isAuthenticated,
  getUserRole,
  fetchUserData
};