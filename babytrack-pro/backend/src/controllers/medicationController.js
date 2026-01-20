const { prisma } = require('../config/database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/medication
 * Create a new medication
 */
const create = async (req, res, next) => {
  try {
    const { babyId, ...medicationData } = req.body;

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

    // Create medication
    const medication = await prisma.medication.create({
      data: {
        babyId,
        ...medicationData,
      },
    });

    logger.info(`Medication created for baby ${baby.name}: ${medication.name}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Medicamento cadastrado com sucesso',
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/medication
 * Get all medications for a baby
 */
const getAll = async (req, res, next) => {
  try {
    const { babyId, isActive } = req.query;

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
    const where = { babyId };
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Get medications
    const medications = await prisma.medication.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: medications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/medication/:id
 * Get a single medication
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const medication = await prisma.medication.findFirst({
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

    if (!medication) {
      throw new AppError('Medicamento não encontrado', HTTP_STATUS.NOT_FOUND, 'MEDICATION_NOT_FOUND');
    }

    // Verify baby belongs to user
    if (medication.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/medication/:id
 * Update a medication
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get medication and verify ownership
    const existingMedication = await prisma.medication.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingMedication) {
      throw new AppError('Medicamento não encontrado', HTTP_STATUS.NOT_FOUND, 'MEDICATION_NOT_FOUND');
    }

    if (existingMedication.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Update medication
    const medication = await prisma.medication.update({
      where: { id },
      data: req.body,
    });

    logger.info(`Medication updated: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Medicamento atualizado com sucesso',
      data: medication,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/medication/:id
 * Delete a medication
 */
const deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get medication and verify ownership
    const existingMedication = await prisma.medication.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!existingMedication) {
      throw new AppError('Medicamento não encontrado', HTTP_STATUS.NOT_FOUND, 'MEDICATION_NOT_FOUND');
    }

    if (existingMedication.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Delete medication (cascade deletes logs)
    await prisma.medication.delete({
      where: { id },
    });

    logger.info(`Medication deleted: ${id}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Medicamento removido com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/medication/:id/log
 * Create a medication log entry
 */
const createLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledTime, takenAt, skipped, notes } = req.body;

    // Get medication and verify ownership
    const medication = await prisma.medication.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!medication) {
      throw new AppError('Medicamento não encontrado', HTTP_STATUS.NOT_FOUND, 'MEDICATION_NOT_FOUND');
    }

    if (medication.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Create log
    const log = await prisma.medicationLog.create({
      data: {
        medicationId: id,
        scheduledTime: parseISO(scheduledTime),
        takenAt: takenAt ? parseISO(takenAt) : null,
        skipped: skipped || false,
        notes,
      },
    });

    logger.info(`Medication log created for medication ${id}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registro de medicação criado com sucesso',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/medication/:id/logs
 * Get all logs for a medication
 */
const getLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // Get medication and verify ownership
    const medication = await prisma.medication.findFirst({
      where: { id },
      include: {
        baby: {
          select: { userId: true },
        },
      },
    });

    if (!medication) {
      throw new AppError('Medicamento não encontrado', HTTP_STATUS.NOT_FOUND, 'MEDICATION_NOT_FOUND');
    }

    if (medication.baby.userId !== req.user.id) {
      throw new AppError('Acesso negado', HTTP_STATUS.FORBIDDEN, 'FORBIDDEN');
    }

    // Build where clause
    const where = {
      medicationId: id,
    };

    if (startDate || endDate) {
      where.scheduledTime = {};
      if (startDate) where.scheduledTime.gte = parseISO(startDate);
      if (endDate) where.scheduledTime.lte = parseISO(endDate);
    }

    // Get total count
    const total = await prisma.medicationLog.count({ where });

    // Get logs
    const logs = await prisma.medicationLog.findMany({
      where,
      orderBy: {
        scheduledTime: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        logs,
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
 * GET /api/medication/today
 * Get today's medication schedule for a baby
 */
const getToday = async (req, res, next) => {
  try {
    const { babyId } = req.query;
    const today = new Date();

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

    // Get active medications
    const medications = await prisma.medication.findMany({
      where: {
        babyId,
        isActive: true,
        startDate: {
          lte: today,
        },
        OR: [
          { endDate: null },
          { endDate: { gte: today } },
        ],
      },
      include: {
        logs: {
          where: {
            scheduledTime: {
              gte: startOfDay(today),
              lte: endOfDay(today),
            },
          },
        },
      },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: medications,
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
  delete: deleteMedication,
  createLog,
  getLogs,
  getToday,
};
