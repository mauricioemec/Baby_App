const express = require('express');
const { z } = require('zod');
const symptomController = require('../controllers/symptomController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody, validateParams, validateQuery, uuidSchema, paginationSchema } = require('../middleware/validator');
const { SYMPTOM_TYPES, SYMPTOM_SEVERITY, VALIDATION } = require('../utils/constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation schemas
const createSymptomSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum(Object.values(SYMPTOM_TYPES)),
  severity: z.enum(Object.values(SYMPTOM_SEVERITY)),
  description: z.string().min(1, 'Descrição é obrigatória'),
  temperature: z.number().min(VALIDATION.MIN_TEMPERATURE).max(VALIDATION.MAX_TEMPERATURE).optional().nullable(),
  timestamp: z.string().datetime().optional(),
});

const updateSymptomSchema = createSymptomSchema.omit({ babyId: true }).partial();

const symptomQuerySchema = paginationSchema.extend({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum(Object.values(SYMPTOM_TYPES)).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Routes
router.post('/', validateBody(createSymptomSchema), symptomController.create);
router.get('/', validateQuery(symptomQuerySchema), symptomController.getAll);
router.get('/:id', validateParams(uuidSchema), symptomController.getById);
router.put('/:id', validateParams(uuidSchema), validateBody(updateSymptomSchema), symptomController.update);
router.delete('/:id', validateParams(uuidSchema), symptomController.delete);

module.exports = router;
