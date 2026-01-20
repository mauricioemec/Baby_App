const { prisma } = require('../config/database');
const { parseISO } = require('date-fns');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/symptom
 * Create a new symptom record
 */
const create = async (req, res, next) => {
  try {
    const { babyId, ...symptomData } = req.body;

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

    // Create symptom record
    const symptom = await prisma.symptom.create({
      data: {
        babyId,
        ...symptomData,
      },
    });

    logger.info(`Symptom record created for baby ${baby.name}: ${symptom.type}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Sintoma registrado com sucesso',
      data: symptom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/symptom
 * Get all symptom records for a baby with optional filters
 */
const getAll = async (req, res, next) => {
  try {
    const { babyId, type, startDate, endDate, page = 1, limit = 50 } = req.query;

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

    if (type) {
      where.type = type;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = parseISO(startDate);
      if (endDate) where.timestamp.lte = parseISO(endDate);
    }

    // Get total count
    const total = await prisma.symptom.count({ where });

    // Get symptoms
    const symptoms = await prisma.symptom.findMany({
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
        symptoms,
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
 * GET /api/symptom/:id
 * Get a single symptom record
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const symptom = await prisma.symptom.findFirst({
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

    if (!symptom) {
      throw new AppError('Sintoma não encontrado', HTTP_STATUS.NOT_FOUND, 'SYMPTOM_NOT_FOUND');
    }

    // Verify baby belongs to user
    if (symptom.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: symptom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/symptom/:id
 * Update a symptom record
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get symptom and verify ownership
    const existingSymptom = await prisma.symptom.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingSymptom) {
      throw new AppError('Sintoma não encontrado', HTTP_STATUS.NOT_FOUND, 'SYMPTOM_NOT_FOUND');
    }

    if (existingSymptom.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Update symptom
    const symptom = await prisma.symptom.update({
      where: { id },
      data: req.body,
    });

    logger.info(`Symptom record updated: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sintoma atualizado com sucesso',
      data: symptom,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/symptom/:id
 * Delete a symptom record
 */
const deleteSymptom = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get symptom and verify ownership
    const existingSymptom = await prisma.symptom.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingSymptom) {
      throw new AppError('Sintoma não encontrado', HTTP_STATUS.NOT_FOUND, 'SYMPTOM_NOT_FOUND');
    }

    if (existingSymptom.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Delete symptom
    await prisma.symptom.delete({
      where: { id },
    });

    logger.info(`Symptom record deleted: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sintoma removido com sucesso',
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
  delete: deleteSymptom,
};
