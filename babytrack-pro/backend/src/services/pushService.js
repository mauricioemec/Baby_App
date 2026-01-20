const { getMessaging } = require('../config/firebase');
const { prisma } = require('../config/database');
const logger = require('../utils/logger');

/**
 * Send push notification to a user
 * @param {string} userId - User ID
 * @param {Object} notification - Notification payload
 * @param {string} notification.title - Notification title
 * @param {string} notification.body - Notification body
 * @param {Object} notification.data - Additional data
 * @returns {Promise<void>}
 */
const sendNotificationToUser = async (userId, notification) => {
  const messaging = getMessaging();
  if (!messaging) {
    logger.warn('Firebase not configured. Push notification not sent.');
    return;
  }

  try {
    // Get all FCM tokens for this user
    const fcmTokens = await prisma.fcmToken.findMany({
      where: { userId },
      select: { token: true },
    });

    if (fcmTokens.length === 0) {
      logger.debug(`No FCM tokens found for user ${userId}`);
      return;
    }

    const tokens = fcmTokens.map(t => t.token);

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data || {},
      tokens,
    };

    const response = await messaging.sendEachForMulticast(message);

    logger.info(`Notification sent to user ${userId}: ${response.successCount} success, ${response.failureCount} failures`);

    // Remove invalid tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const error = resp.error;
          if (
            error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered'
          ) {
            failedTokens.push(tokens[idx]);
          }
        }
      });

      if (failedTokens.length > 0) {
        await prisma.fcmToken.deleteMany({
          where: {
            token: { in: failedTokens },
          },
        });
        logger.info(`Removed ${failedTokens.length} invalid FCM tokens`);
      }
    }
  } catch (error) {
    logger.error('Error sending push notification:', error);
  }
};

/**
 * Send feeding reminder notification
 * @param {string} userId - User ID
 * @param {string} babyName - Baby name
 * @param {number} hours - Hours since last feeding
 * @returns {Promise<void>}
 */
const sendFeedingReminder = async (userId, babyName, hours) => {
  await sendNotificationToUser(userId, {
    title: '🍼 Lembrete de Mamada',
    body: `Já se passaram ${hours} horas desde a última mamada de ${babyName}!`,
    data: {
      type: 'feeding_reminder',
      babyName,
    },
  });
};

/**
 * Send medication reminder notification
 * @param {string} userId - User ID
 * @param {string} babyName - Baby name
 * @param {string} medicationName - Medication name
 * @param {string} dosage - Dosage
 * @param {string} time - Scheduled time
 * @returns {Promise<void>}
 */
const sendMedicationReminder = async (userId, babyName, medicationName, dosage, time) => {
  await sendNotificationToUser(userId, {
    title: '💊 Lembrete de Medicação',
    body: `Hora de dar ${medicationName} (${dosage}) para ${babyName} às ${time}`,
    data: {
      type: 'medication_reminder',
      babyName,
      medicationName,
      dosage,
      time,
    },
  });
};

/**
 * Send low intake alert notification
 * @param {string} userId - User ID
 * @param {string} babyName - Baby name
 * @param {number} percentage - Percentage of target achieved
 * @returns {Promise<void>}
 */
const sendLowIntakeAlert = async (userId, babyName, percentage) => {
  await sendNotificationToUser(userId, {
    title: '⚠️ Alerta de Baixa Ingestão',
    body: `${babyName} atingiu apenas ${percentage}% da meta de ingestão hoje!`,
    data: {
      type: 'low_intake_alert',
      babyName,
      percentage: percentage.toString(),
    },
  });
};

module.exports = {
  sendNotificationToUser,
  sendFeedingReminder,
  sendMedicationReminder,
  sendLowIntakeAlert,
};
