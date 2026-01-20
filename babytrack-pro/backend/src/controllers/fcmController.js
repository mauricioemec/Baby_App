const { prisma } = require('../config/database');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/fcm/register
 * Register FCM token for push notifications
 */
const registerToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    // Check if token already exists
    const existingToken = await prisma.fcmToken.findUnique({
      where: { token },
    });

    if (existingToken) {
      // Update user if different
      if (existingToken.userId !== userId) {
        await prisma.fcmToken.update({
          where: { token },
          data: { userId },
        });
        logger.info(`FCM token reassigned to user ${req.user.email}`);
      }
    } else {
      // Create new token
      await prisma.fcmToken.create({
        data: {
          userId,
          token,
        },
      });
      logger.info(`FCM token registered for user ${req.user.email}`);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token FCM registrado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/fcm/unregister
 * Unregister FCM token
 */
const unregisterToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Delete token if exists
    const deleted = await prisma.fcmToken.deleteMany({
      where: {
        token,
        userId: req.user.id,
      },
    });

    if (deleted.count > 0) {
      logger.info(`FCM token unregistered for user ${req.user.email}`);
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token FCM removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerToken,
  unregisterToken,
};
