const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { initializeTransporter } = require('./services/emailService');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { apiRateLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/authRoutes');
const babyRoutes = require('./routes/babyRoutes');
const recordsRoutes = require('./routes/recordsRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const fcmRoutes = require('./routes/fcmRoutes');

// Import cron jobs
const { initNotificationCron } = require('./cron/notificationCron');
const { initLowIntakeCron } = require('./cron/lowIntakeCron');

// Create Express app
const app = express();

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(req.method, req.originalUrl, res.statusCode, duration);
  });

  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BabyTrack Pro API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/baby', apiRateLimiter, babyRoutes);
app.use('/api', apiRateLimiter, recordsRoutes);
app.use('/api/medication', apiRateLimiter, medicationRoutes);
app.use('/api/symptom', apiRateLimiter, symptomRoutes);
app.use('/api/fcm', apiRateLimiter, fcmRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// ==================== INITIALIZATION ====================

const initializeServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize Firebase (optional)
    initializeFirebase();

    // Initialize email service (optional)
    initializeTransporter();

    // Initialize cron jobs
    if (env.ENABLE_CRON_JOBS) {
      initNotificationCron();
      initLowIntakeCron();
    } else {
      logger.warn('⚠ Cron jobs are disabled');
    }

    // Start server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      logger.success(`
╔═══════════════════════════════════════════╗
║                                           ║
║       🍼 BabyTrack Pro API Server 🍼      ║
║                                           ║
║  Environment: ${env.NODE_ENV.padEnd(28)}║
║  Port: ${PORT.toString().padEnd(35)}║
║  Database: Connected ✓                    ║
║                                           ║
╚═══════════════════════════════════════════╝
      `);

      logger.info(`Server is running on http://localhost:${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Initialize and start server
initializeServer();

module.exports = app;
