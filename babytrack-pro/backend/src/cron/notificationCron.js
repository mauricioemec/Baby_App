const cron = require('node-cron');
const { prisma } = require('../config/database');
const pushService = require('../services/pushService');
const logger = require('../utils/logger');
const { differenceInHours, parseISO, format, addMinutes, startOfMinute } = require('date-fns');
const { MEDICATION_REMINDER_MINUTES_BEFORE } = require('../utils/constants');

/**
 * Check feeding reminders for all babies
 */
const checkFeedingReminders = async () => {
  try {
    // Get all babies with feeding reminders enabled
    const babies = await prisma.baby.findMany({
      where: {
        enableFeedingReminder: true,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        feedings: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 1,
        },
      },
    });

    for (const baby of babies) {
      const lastFeeding = baby.feedings[0];

      if (!lastFeeding) {
        // No feedings yet, skip
        continue;
      }

      const hoursSinceLastFeeding = differenceInHours(new Date(), lastFeeding.timestamp);

      // Check if reminder should be sent
      if (hoursSinceLastFeeding >= baby.feedingReminderHours) {
        await pushService.sendFeedingReminder(
          baby.user.id,
          baby.name,
          Math.floor(hoursSinceLastFeeding)
        );

        logger.info(`Feeding reminder sent for baby ${baby.name}`);
      }
    }
  } catch (error) {
    logger.error('Error checking feeding reminders:', error);
  }
};

/**
 * Check medication reminders for all active medications
 */
const checkMedicationReminders = async () => {
  try {
    const now = new Date();
    const reminderTime = addMinutes(now, MEDICATION_REMINDER_MINUTES_BEFORE);
    const reminderTimeStart = startOfMinute(reminderTime);
    const reminderTimeEnd = addMinutes(reminderTimeStart, 1);

    // Get all active medications with reminders enabled
    const babies = await prisma.baby.findMany({
      where: {
        enableMedicationReminder: true,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        medications: {
          where: {
            isActive: true,
            startDate: {
              lte: now,
            },
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        },
      },
    });

    for (const baby of babies) {
      for (const medication of baby.medications) {
        const times = Array.isArray(medication.times) ? medication.times : [];

        for (const timeStr of times) {
          // Parse time string (HH:mm)
          const [hours, minutes] = timeStr.split(':').map(Number);
          const scheduledTime = new Date(now);
          scheduledTime.setHours(hours, minutes, 0, 0);

          // Check if this time matches the reminder window
          if (scheduledTime >= reminderTimeStart && scheduledTime < reminderTimeEnd) {
            // Check if log already exists for this scheduled time
            const existingLog = await prisma.medicationLog.findFirst({
              where: {
                medicationId: medication.id,
                scheduledTime: scheduledTime,
              },
            });

            if (!existingLog) {
              // Send reminder
              await pushService.sendMedicationReminder(
                baby.user.id,
                baby.name,
                medication.name,
                medication.dosage,
                timeStr
              );

              logger.info(`Medication reminder sent for ${medication.name} - ${baby.name}`);
            }
          }
        }
      }
    }
  } catch (error) {
    logger.error('Error checking medication reminders:', error);
  }
};

/**
 * Initialize notification cron job
 * Runs every 5 minutes
 */
const initNotificationCron = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running notification cron job...');
    await checkFeedingReminders();
    await checkMedicationReminders();
  });

  logger.info('✓ Notification cron job initialized (every 5 minutes)');
};

module.exports = {
  initNotificationCron,
  checkFeedingReminders,
  checkMedicationReminders,
};
