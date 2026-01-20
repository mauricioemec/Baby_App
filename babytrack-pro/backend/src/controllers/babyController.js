const { prisma } = require('../config/database');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/baby
 * Create a new baby
 */
const create = async (req, res, next) => {
  try {
    const baby = await prisma.baby.create({
      data: {
        ...req.body,
        userId: req.user.id,
      },
    });

    logger.info(`Baby created: ${baby.name} by user ${req.user.email}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Bebê cadastrado com sucesso',
      data: baby,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/baby
 * Get all babies for current user
 */
const getAll = async (req, res, next) => {
  try {
    const babies = await prisma.baby.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: babies,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/baby/:id
 * Get a single baby by ID
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const baby = await prisma.baby.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!baby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: baby,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/baby/:id
 * Update a baby
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if baby exists and belongs to user
    const existingBaby = await prisma.baby.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingBaby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    // Update baby
    const baby = await prisma.baby.update({
      where: { id },
      data: req.body,
    });

    logger.info(`Baby updated: ${baby.name} by user ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Bebê atualizado com sucesso',
      data: baby,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/baby/:id
 * Delete a baby (cascade deletes all related records)
 */
const deleteBaby = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if baby exists and belongs to user
    const existingBaby = await prisma.baby.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!existingBaby) {
      throw new AppError('Bebê não encontrado', HTTP_STATUS.NOT_FOUND, 'BABY_NOT_FOUND');
    }

    // Delete baby (cascade deletes all related records)
    await prisma.baby.delete({
      where: { id },
    });

    logger.info(`Baby deleted: ${existingBaby.name} by user ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Bebê removido com sucesso',
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
  delete: deleteBaby,
};
