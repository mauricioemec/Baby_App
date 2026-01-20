import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('babytrack_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('babytrack_token');
          localStorage.removeItem('babytrack_user');
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden
          console.error('Access forbidden:', data.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data.errors);
          break;

        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;

        default:
          console.error('API error:', data.message);
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response from server');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        status: 'network_error'
      });
    } else {
      // Error in request setup
      console.error('Request error:', error.message);
      return Promise.reject({
        message: 'An error occurred while making the request.',
        status: 'request_error'
      });
    }
  }
);

export default api;
