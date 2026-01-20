import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import api from './api';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

let firebaseApp = null;
let messaging = null;

/**
 * Initialize Firebase
 */
export const initializeFirebase = () => {
  try {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig);
      messaging = getMessaging(firebaseApp);
    }
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
};

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return null;
    }

    // Initialize Firebase if not already done
    if (!messaging) {
      initializeFirebase();
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted');

      // Get FCM token
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });

      if (token) {
        console.log('FCM Token:', token);
        return token;
      } else {
        console.warn('No registration token available');
        return null;
      }
    } else {
      console.warn('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Register FCM token with backend
 * @param {string} token - FCM token
 * @returns {Promise} Response data
 */
export const registerFCMToken = async (token) => {
  try {
    const response = await api.post('/notifications/register-token', { token });
    return response.data;
  } catch (error) {
    console.error('Error registering FCM token:', error);
    throw error;
  }
};

/**
 * Unregister FCM token from backend
 * @param {string} token - FCM token
 * @returns {Promise} Response data
 */
export const unregisterFCMToken = async (token) => {
  try {
    const response = await api.post('/notifications/unregister-token', { token });
    return response.data;
  } catch (error) {
    console.error('Error unregistering FCM token:', error);
    throw error;
  }
};

/**
 * Setup foreground message listener
 * @param {Function} callback - Callback function to handle messages
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    initializeFirebase();
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

/**
 * Get notification settings
 * @returns {Promise} Notification settings
 */
export const getNotificationSettings = async () => {
  try {
    const response = await api.get('/notifications/settings');
    return response.data;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    throw error;
  }
};

/**
 * Update notification settings
 * @param {Object} settings - Notification settings
 * @returns {Promise} Updated settings
 */
export const updateNotificationSettings = async (settings) => {
  try {
    const response = await api.put('/notifications/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

/**
 * Send test notification
 * @returns {Promise} Response data
 */
export const sendTestNotification = async () => {
  try {
    const response = await api.post('/notifications/test');
    return response.data;
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw error;
  }
};

export default {
  initializeFirebase,
  requestNotificationPermission,
  registerFCMToken,
  unregisterFCMToken,
  onForegroundMessage,
  getNotificationSettings,
  updateNotificationSettings,
  sendTestNotification
};
