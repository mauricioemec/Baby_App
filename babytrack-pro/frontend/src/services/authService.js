import api from './api';

/**
 * Auth Service - Handles authentication operations
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} User data and token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials (email/phone + password)
 * @returns {Promise} User data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  // Save token and user data
  if (response.data.token) {
    localStorage.setItem('babytrack_token', response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem('babytrack_user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Send OTP to phone
 * @param {string} phone - Phone number
 * @returns {Promise} Response data
 */
export const sendOTP = async (phone) => {
  const response = await api.post('/auth/send-otp', { phone });
  return response.data;
};

/**
 * Verify OTP
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise} User data and token
 */
export const verifyOTP = async (phone, otp) => {
  const response = await api.post('/auth/verify-otp', { phone, otp });

  // Save token and user data
  if (response.data.token) {
    localStorage.setItem('babytrack_token', response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem('babytrack_user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Logout user
 * @returns {Promise} Response data
 */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem('babytrack_token');
    localStorage.removeItem('babytrack_user');
  }
};

/**
 * Get current user profile
 * @returns {Promise} User data
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} userData - User data to update
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);

  // Update local storage
  if (response.data.user) {
    localStorage.setItem('babytrack_user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Accept consent terms
 * @returns {Promise} Response data
 */
export const acceptConsent = async () => {
  const response = await api.post('/auth/accept-consent');

  // Update local storage
  if (response.data.user) {
    localStorage.setItem('babytrack_user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Response data
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/auth/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

/**
 * Request password reset
 * @param {string} email - Email address
 * @returns {Promise} Response data
 */
export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Response data
 */
export const resetPassword = async (token, newPassword) => {
  const response = await api.post('/auth/reset-password', {
    token,
    newPassword
  });
  return response.data;
};

export default {
  register,
  login,
  sendOTP,
  verifyOTP,
  logout,
  getProfile,
  updateProfile,
  acceptConsent,
  changePassword,
  requestPasswordReset,
  resetPassword
};
