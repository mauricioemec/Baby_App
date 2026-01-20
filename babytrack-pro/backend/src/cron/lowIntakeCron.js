const cron = require('node-cron');
const { prisma } = require('../config/database');
const pushService = require('../services/pushService');
const calculationService = require('../services/calculationService');
const logger = require('../utils/logger');
const { startOfDay, endOfDay } = require('date-fns');
const { LOW_INTAKE_THRESHOLD } = require('../utils/constants');

/**
 * Check low intake alerts for all babies
 */
const checkLowIntakeAlerts = async () => {
  try {
    const today = new Date();

    // Get all babies with low intake alerts enabled
    const babies = await prisma.baby.findMany({
      where: {
        enableLowIntakeAlert: true,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        feedings: {
          where: {
            timestamp: {
              gte: startOfDay(today),
              lte: endOfDay(today),
            },
          },
        },
        growths: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 5,
        },
      },
    });

    for (const baby of babies) {
      // Calculate total feeding volume for today
      const totalVolume = calculationService.calculateTotalFeedingVolume(baby.feedings, baby);

      // Calculate theoretical weight and daily target
      const theoreticalWeight = calculationService.calculateTheoreticalWeight(baby, baby.growths, today);
      const dailyTarget = calculationService.calculateDailyMilkTarget(theoreticalWeight, baby.mlPerKgTarget);

      // Calculate percentage
      const percentage = calculationService.calculateTargetPercentage(totalVolume, dailyTarget);

      // Check if below threshold
      if (percentage < LOW_INTAKE_THRESHOLD * 100) {
        await pushService.sendLowIntakeAlert(
          baby.user.id,
          baby.name,
          percentage
        );

        logger.info(`Low intake alert sent for baby ${baby.name}: ${percentage}%`);
      }
    }
  } catch (error) {
    logger.error('Error checking low intake alerts:', error);
  }
};

/**
 * Initialize low intake cron job
 * Runs daily at 6 PM (18:00)
 */
const initLowIntakeCron = () => {
  // Run daily at 18:00 (6 PM)
  cron.schedule('0 18 * * *', async () => {
    logger.info('Running low intake cron job...');
    await checkLowIntakeAlerts();
  });

  logger.info('✓ Low intake cron job initialized (daily at 18:00)');
};

module.exports = {
  initLowIntakeCron,
  checkLowIntakeAlerts,
};
