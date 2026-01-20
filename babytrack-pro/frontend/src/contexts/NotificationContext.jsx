import { createContext, useState, useEffect, useCallback } from 'react';
import * as fcmService from '../services/fcmService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Initialize FCM on mount
  useEffect(() => {
    fcmService.initializeFirebase();
  }, []);

  // Setup foreground message listener
  useEffect(() => {
    const unsubscribe = fcmService.onForegroundMessage((payload) => {
      // Show toast notification
      showToast({
        title: payload.notification?.title || 'Notification',
        message: payload.notification?.body || '',
        type: 'info',
        duration: 5000
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /**
   * Request notification permission and register token
   */
  const requestPermission = async () => {
    try {
      const token = await fcmService.requestNotificationPermission();

      if (token) {
        await fcmService.registerFCMToken(token);
        setFcmToken(token);
        localStorage.setItem('babytrack_fcm_token', token);

        return token;
      }

      return null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  };

  /**
   * Unregister FCM token
   */
  const unregisterToken = async () => {
    try {
      if (fcmToken) {
        await fcmService.unregisterFCMToken(fcmToken);
        setFcmToken(null);
        localStorage.removeItem('babytrack_fcm_token');
      }
    } catch (error) {
      console.error('Error unregistering token:', error);
      throw error;
    }
  };

  /**
   * Load notification settings
   */
  const loadSettings = async () => {
    try {
      const data = await fcmService.getNotificationSettings();
      setNotificationSettings(data.settings);
      return data.settings;
    } catch (error) {
      console.error('Error loading notification settings:', error);
      throw error;
    }
  };

  /**
   * Update notification settings
   */
  const updateSettings = async (settings) => {
    try {
      const data = await fcmService.updateNotificationSettings(settings);
      setNotificationSettings(data.settings);
      return data.settings;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  };

  /**
   * Send test notification
   */
  const sendTestNotification = async () => {
    try {
      await fcmService.sendTestNotification();
      showToast({
        title: 'Test notification sent',
        message: 'Check your device for the notification',
        type: 'success'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  };

  /**
   * Show toast notification
   */
  const showToast = useCallback(
    ({
      title,
      message,
      type = 'info',
      duration = 3000,
      action = null
    }) => {
      const id = Date.now() + Math.random();

      const toast = {
        id,
        title,
        message,
        type,
        action
      };

      setToasts(prev => [...prev, toast]);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    []
  );

  /**
   * Remove toast
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Show success toast
   */
  const showSuccess = useCallback(
    (message, title = 'Success') => {
      return showToast({ title, message, type: 'success' });
    },
    [showToast]
  );

  /**
   * Show error toast
   */
  const showError = useCallback(
    (message, title = 'Error') => {
      return showToast({ title, message, type: 'error', duration: 5000 });
    },
    [showToast]
  );

  /**
   * Show warning toast
   */
  const showWarning = useCallback(
    (message, title = 'Warning') => {
      return showToast({ title, message, type: 'warning', duration: 4000 });
    },
    [showToast]
  );

  /**
   * Show info toast
   */
  const showInfo = useCallback(
    (message, title = 'Info') => {
      return showToast({ title, message, type: 'info' });
    },
    [showToast]
  );

  const value = {
    fcmToken,
    notificationSettings,
    toasts,
    requestPermission,
    unregisterToken,
    loadSettings,
    updateSettings,
    sendTestNotification,
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
