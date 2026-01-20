const { prisma } = require('../config/database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const calculationService = require('../services/calculationService');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/diaper
 * Create a new diaper record
 */
const create = async (req, res, next) => {
  try {
    const { babyId, ...diaperData } = req.body;

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

    // Create diaper record
    const diaper = await prisma.diaper.create({
      data: {
        babyId,
        ...diaperData,
      },
    });

    logger.info(`Diaper record created for baby ${baby.name}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registro de fralda criado com sucesso',
      data: diaper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/diaper
 * Get all diaper records for a baby with optional date range
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
    const total = await prisma.diaper.count({ where });

    // Get diapers
    const diapers = await prisma.diaper.findMany({
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
        diapers,
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
 * GET /api/diaper/:id
 * Get a single diaper record
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const diaper = await prisma.diaper.findFirst({
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

    if (!diaper) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'DIAPER_NOT_FOUND');
    }

    // Verify baby belongs to user
    if (diaper.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: diaper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/diaper/:id
 * Update a diaper record
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get diaper and verify ownership
    const existingDiaper = await prisma.diaper.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingDiaper) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'DIAPER_NOT_FOUND');
    }

    if (existingDiaper.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Update diaper
    const diaper = await prisma.diaper.update({
      where: { id },
      data: req.body,
    });

    logger.info(`Diaper record updated: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro atualizado com sucesso',
      data: diaper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/diaper/:id
 * Delete a diaper record
 */
const deleteDiaper = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get diaper and verify ownership
    const existingDiaper = await prisma.diaper.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingDiaper) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'DIAPER_NOT_FOUND');
    }

    if (existingDiaper.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Delete diaper
    await prisma.diaper.delete({
      where: { id },
    });

    logger.info(`Diaper record deleted: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/diaper/stats
 * Get diaper statistics for a baby
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

    // Get diapers for today
    const diapers = await prisma.diaper.findMany({
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

    // Calculate total pee volume
    const totalPeeVolume = calculationService.calculateTotalPeeVolume(diapers, baby.diaperTareWeight);

    // Calculate theoretical weight and target
    const theoreticalWeight = calculationService.calculateTheoreticalWeight(baby, growthRecords, targetDate);
    const dailyPeeTarget = calculationService.calculateDailyPeeTarget(theoreticalWeight);
    const percentage = calculationService.calculateTargetPercentage(totalPeeVolume, dailyPeeTarget);

    // Count by type
    const peeCount = diapers.filter(d => d.type === 'pee' || d.type === 'both').length;
    const poopCount = diapers.filter(d => d.type === 'poop' || d.type === 'both').length;

    // Get last diaper
    const lastDiaper = diapers[0] || null;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        totalPeeVolume: Math.round(totalPeeVolume),
        dailyPeeTarget: Math.round(dailyPeeTarget),
        percentage,
        theoreticalWeight: Math.round(theoreticalWeight),
        peeCount,
        poopCount,
        totalCount: diapers.length,
        lastDiaper,
        diapers,
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
  delete: deleteDiaper,
  getStats,
};
