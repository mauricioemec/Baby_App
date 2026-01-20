const { prisma } = require('../config/database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const calculationService = require('../services/calculationService');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/feeding
 * Create a new feeding record
 */
const create = async (req, res, next) => {
  try {
    const { babyId, ...feedingData } = req.body;

    // Verify baby belongs to user
    const baby = await prisma.baby.findFirst({
      where: {
        id: babyId,
        userId: req.user.id,
      },
    });

    if (!baby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    // Create feeding record
    const feeding = await prisma.feeding.create({
      data: {
        babyId,
        ...feedingData,
      },
    });

    logger.info(`Feeding record created for baby ${baby.name}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registro de mamada criado com sucesso',
      data: feeding,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/feeding
 * Get all feeding records for a baby with optional date range
 */
const getAll = async (req, res, next) => {
  try {
    const { babyId, startDate, endDate, page = 1, limit = 50 } = req.query;

    // Verify baby belongs to user
    const baby = await prisma.baby.findFirst({
      where: {
        id: babyId,
        userId: req.user.id,
      },
    });

    if (!baby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    // Build where clause
    const where = {
      babyId,
    };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = parseISO(startDate);
      if (endDate) where.timestamp.lte = parseISO(endDate);
    }

    // Get total count
    const total = await prisma.feeding.count({ where });

    // Get feedings
    const feedings = await prisma.feeding.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        feedings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/feeding/:id
 * Get a single feeding record
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const feeding = await prisma.feeding.findFirst({
      where: { id },
      include: {
        baby: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });

    if (!feeding) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'FEEDING_NOT_FOUND');
    }

    // Verify baby belongs to user
    if (feeding.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: feeding,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/feeding/:id
 * Update a feeding record
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get feeding and verify ownership
    const existingFeeding = await prisma.feeding.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingFeeding) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'FEEDING_NOT_FOUND');
    }

    if (existingFeeding.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Update feeding
    const feeding = await prisma.feeding.update({
      where: { id },
      data: req.body,
    });

    logger.info(`Feeding record updated: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro atualizado com sucesso',
      data: feeding,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/feeding/:id
 * Delete a feeding record
 */
const deleteFeeding = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get feeding and verify ownership
    const existingFeeding = await prisma.feeding.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingFeeding) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'FEEDING_NOT_FOUND');
    }

    if (existingFeeding.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Delete feeding
    await prisma.feeding.delete({
      where: { id },
    });

    logger.info(`Feeding record deleted: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/feeding/stats
 * Get feeding statistics for a baby
 */
const getStats = async (req, res, next) => {
  try {
    const { babyId, date } = req.query;
    const targetDate = date ? parseISO(date) : new Date();

    // Verify baby belongs to user
    const baby = await prisma.baby.findFirst({
      where: {
        id: babyId,
        userId: req.user.id,
      },
    });

    if (!baby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    // Get feedings for today
    const feedings = await prisma.feeding.findMany({
      where: {
        babyId,
        timestamp: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Get growth records for theoretical weight calculation
    const growthRecords = await prisma.growth.findMany({
      where: { babyId },
      orderBy: {
        timestamp: 'desc',
      },
      take: 5,
    });

    // Calculate total volume
    const totalVolume = calculationService.calculateTotalFeedingVolume(feedings, baby);

    // Calculate theoretical weight and target
    const theoreticalWeight = calculationService.calculateTheoreticalWeight(baby, growthRecords, targetDate);
    const dailyTarget = calculationService.calculateDailyMilkTarget(theoreticalWeight, baby.mlPerKgTarget);
    const percentage = calculationService.calculateTargetPercentage(totalVolume, dailyTarget);

    // Get last feeding time
    const lastFeeding = feedings[0] || null;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        totalVolume: Math.round(totalVolume),
        dailyTarget: Math.round(dailyTarget),
        percentage,
        theoreticalWeight: Math.round(theoreticalWeight),
        feedingCount: feedings.length,
        lastFeeding,
        feedings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteFeeding,
  getStats,
};
