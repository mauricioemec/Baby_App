import { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('babytrack_token');
        const userData = localStorage.getItem('babytrack_user');

        if (token && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('babytrack_token');
        localStorage.removeItem('babytrack_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);

      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      const data = await authService.register(userData);

      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Send OTP to phone
   */
  const sendOTP = async (phone) => {
    try {
      return await authService.sendOTP(phone);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Verify OTP and login
   */
  const verifyOTP = async (phone, otp) => {
    try {
      const data = await authService.verifyOTP(phone, otp);

      setUser(data.user);
      setIsAuthenticated(true);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData) => {
    try {
      const data = await authService.updateProfile(userData);

      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Accept consent terms
   */
  const acceptConsent = async () => {
    try {
      const data = await authService.acceptConsent();

      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh user data
   */
  const refreshUser = async () => {
    try {
      const data = await authService.getProfile();

      setUser(data.user);
      localStorage.setItem('babytrack_user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    sendOTP,
    verifyOTP,
    logout,
    updateProfile,
    acceptConsent,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
