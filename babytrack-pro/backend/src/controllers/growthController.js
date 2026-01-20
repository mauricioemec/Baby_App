const { prisma } = require('../config/database');
const { parseISO } = require('date-fns');
const omsService = require('../services/omsService');
const calculationService = require('../services/calculationService');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/growth
 * Create a new growth record with percentile calculation
 */
const create = async (req, res, next) => {
  try {
    const { babyId, weightGrams, heightCm, headCircumferenceCm, timestamp, notes } = req.body;

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

    // Calculate age at measurement time
    const measurementDate = timestamp ? parseISO(timestamp) : new Date();
    const age = calculationService.getEffectiveAge(baby, measurementDate);

    // Calculate percentiles
    const weightPercentile = omsService.calculatePercentile(
      weightGrams / 1000, // Convert to kg
      age.months,
      baby.sex,
      'weight'
    );

    const heightPercentile = omsService.calculatePercentile(
      heightCm,
      age.months,
      baby.sex,
      'height'
    );

    let headPercentile = null;
    if (headCircumferenceCm) {
      headPercentile = omsService.calculatePercentile(
        headCircumferenceCm,
        age.months,
        baby.sex,
        'headCircumference'
      );
    }

    // Create growth record
    const growth = await prisma.growth.create({
      data: {
        babyId,
        weightGrams,
        heightCm,
        headCircumferenceCm,
        weightPercentile,
        heightPercentile,
        headPercentile,
        timestamp: measurementDate,
        notes,
      },
    });

    logger.info(`Growth record created for baby ${baby.name}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registro de crescimento criado com sucesso',
      data: growth,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/growth
 * Get all growth records for a baby
 */
const getAll = async (req, res, next) => {
  try {
    const { babyId, page = 1, limit = 50 } = req.query;

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

    // Get total count
    const total = await prisma.growth.count({
      where: { babyId },
    });

    // Get growth records
    const growths = await prisma.growth.findMany({
      where: { babyId },
      orderBy: {
        timestamp: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        growths,
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
 * GET /api/growth/latest
 * Get latest growth record for a baby
 */
const getLatest = async (req, res, next) => {
  try {
    const { babyId } = req.query;

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

    // Get latest growth record
    const growth = await prisma.growth.findFirst({
      where: { babyId },
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: growth,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/growth/:id
 * Get a single growth record
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const growth = await prisma.growth.findFirst({
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

    if (!growth) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'GROWTH_NOT_FOUND');
    }

    // Verify baby belongs to user
    if (growth.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: growth,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/growth/:id
 * Update a growth record and recalculate percentiles
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { weightGrams, heightCm, headCircumferenceCm, timestamp, notes } = req.body;

    // Get growth and verify ownership
    const existingGrowth = await prisma.growth.findFirst({
      where: { id },
      include: {
        baby: true,
      },
    });

    if (!existingGrowth) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'GROWTH_NOT_FOUND');
    }

    if (existingGrowth.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Calculate age at measurement time
    const measurementDate = timestamp ? parseISO(timestamp) : existingGrowth.timestamp;
    const age = calculationService.getEffectiveAge(existingGrowth.baby, measurementDate);

    // Recalculate percentiles if measurements changed
    const newWeightGrams = weightGrams !== undefined ? weightGrams : existingGrowth.weightGrams;
    const newHeightCm = heightCm !== undefined ? heightCm : existingGrowth.heightCm;
    const newHeadCircumferenceCm = headCircumferenceCm !== undefined ? headCircumferenceCm : existingGrowth.headCircumferenceCm;

    const weightPercentile = omsService.calculatePercentile(
      newWeightGrams / 1000,
      age.months,
      existingGrowth.baby.sex,
      'weight'
    );

    const heightPercentile = omsService.calculatePercentile(
      newHeightCm,
      age.months,
      existingGrowth.baby.sex,
      'height'
    );

    let headPercentile = null;
    if (newHeadCircumferenceCm) {
      headPercentile = omsService.calculatePercentile(
        newHeadCircumferenceCm,
        age.months,
        existingGrowth.baby.sex,
        'headCircumference'
      );
    }

    // Update growth
    const growth = await prisma.growth.update({
      where: { id },
      data: {
        weightGrams: newWeightGrams,
        heightCm: newHeightCm,
        headCircumferenceCm: newHeadCircumferenceCm,
        weightPercentile,
        heightPercentile,
        headPercentile,
        timestamp: measurementDate,
        notes: notes !== undefined ? notes : existingGrowth.notes,
      },
    });

    logger.info(`Growth record updated: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro atualizado com sucesso',
      data: growth,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/growth/:id
 * Delete a growth record
 */
const deleteGrowth = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get growth and verify ownership
    const existingGrowth = await prisma.growth.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingGrowth) {
      throw new AppError('Registro não encontrado', HTTP_STATUS.NOT_FOUND, 'GROWTH_NOT_FOUND');
    }

    if (existingGrowth.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Delete growth
    await prisma.growth.delete({
      where: { id },
    });

    logger.info(`Growth record deleted: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Registro removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getLatest,
  getById,
  update,
  delete: deleteGrowth,
};
