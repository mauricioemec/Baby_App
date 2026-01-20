const { z } = require('zod');
const { HTTP_STATUS, VALIDATION } = require('../utils/constants');

/**
 * Middleware to validate request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Express middleware
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
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

      next(error);
    }
  };
};

/**
 * Middleware to validate request query against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Express middleware
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
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

      next(error);
    }
  };
};

/**
 * Middleware to validate request params against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} - Express middleware
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(e => ({
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

      next(error);
    }
  };
};

// Common validation schemas

const uuidSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

const paginationSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 50),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  uuidSchema,
  paginationSchema,
  dateRangeSchema,
};
