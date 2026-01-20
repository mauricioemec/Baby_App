const express = require('express');
const { z } = require('zod');
const babyController = require('../controllers/babyController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody, validateParams, uuidSchema } = require('../middleware/validator');
const { VALIDATION, SEX, PERCENTILES } = require('../utils/constants');

const router = express.Router();

// Validation schemas
const createBabySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sex: z.enum([SEX.MALE, SEX.FEMALE], { errorMap: () => ({ message: 'Sexo inválido' }) }),
  birthDate: z.string().datetime('Data de nascimento inválida'),
  expectedDueDate: z.string().datetime().optional().nullable(),
  birthWeight: z.number().min(VALIDATION.MIN_WEIGHT).max(VALIDATION.MAX_WEIGHT),
  birthHeight: z.number().min(VALIDATION.MIN_HEIGHT).max(VALIDATION.MAX_HEIGHT),
  birthHeadCircumference: z.number().min(VALIDATION.MIN_HEAD_CIRCUMFERENCE).max(VALIDATION.MAX_HEAD_CIRCUMFERENCE).optional().nullable(),
  useAdjustedAge: z.boolean().optional().default(false),
  mlPerMinBreastfeeding: z.record(z.number()).optional(),
  mlPerKgTarget: z.number().optional().default(150),
  diaperTareWeight: z.number().optional().default(30),
  feedingReminderHours: z.number().optional().default(3),
  enableFeedingReminder: z.boolean().optional().default(true),
  enableLowIntakeAlert: z.boolean().optional().default(true),
  enableMedicationReminder: z.boolean().optional().default(true),
  omsPercentile: z.enum(PERCENTILES).optional().default('P50'),
});

const updateBabySchema = createBabySchema.partial();

// All routes require authentication
router.use(authMiddleware);

// Routes
router.post('/', validateBody(createBabySchema), babyController.create);
router.get('/', babyController.getAll);
router.get('/:id', validateParams(uuidSchema), babyController.getById);
router.put('/:id', validateParams(uuidSchema), validateBody(updateBabySchema), babyController.update);
router.delete('/:id', validateParams(uuidSchema), babyController.delete);

module.exports = router;
