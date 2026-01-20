const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { Prisma } = require('@prisma/client');
const { ZodError } = require('zod');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'campo';
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: `${field} já está em uso`,
        code: 'DUPLICATE_ENTRY',
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Registro não encontrado',
        code: 'NOT_FOUND',
      });
    }

    // Foreign key constraint failed
    if (err.code === 'P2003') {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Referência inválida',
        code: 'INVALID_REFERENCE',
      });
    }
  }

  // Prisma validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Erro de validação',
      code: 'VALIDATION_ERROR',
      errors,
    });
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'ERROR',
    });
  }

  // Default server error
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
  });
};

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

/**
 * Not found middleware (404)
 */
const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: 'Rota não encontrada',
    code: 'NOT_FOUND',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
};
