const admin = require('firebase-admin');
const logger = require('../utils/logger');

let firebaseApp = null;

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (firebaseApp) {
      return firebaseApp;
    }

    const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

    // Skip initialization if credentials are not provided
    if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
      logger.warn('⚠ Firebase credentials not configured. Push notifications will be disabled.');
      return null;
    }

    const serviceAccount = {
      projectId: FIREBASE_PROJECT_ID,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: FIREBASE_CLIENT_EMAIL,
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('✓ Firebase Admin SDK initialized successfully');
    return firebaseApp;
  } catch (error) {
    logger.error('✗ Firebase initialization failed:', error.message);
    return null;
  }
};

const getMessaging = () => {
  if (!firebaseApp) {
    return null;
  }
  return admin.messaging();
};

module.exports = {
  initializeFirebase,
  getMessaging,
  admin,
};
