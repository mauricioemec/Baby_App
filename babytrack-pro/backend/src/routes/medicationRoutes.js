const express = require('express');
const { z } = require('zod');
const medicationController = require('../controllers/medicationController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody, validateParams, validateQuery, uuidSchema, paginationSchema } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation schemas
const createMedicationSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  name: z.string().min(1, 'Nome do medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  times: z.array(z.string()).min(1, 'Pelo menos um horário é obrigatório'),
  startDate: z.string().datetime('Data de início inválida'),
  endDate: z.string().datetime().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  notes: z.string().optional().nullable(),
});

const updateMedicationSchema = createMedicationSchema.omit({ babyId: true }).partial();

const medicationQuerySchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  isActive: z.string().optional(),
});

const createLogSchema = z.object({
  scheduledTime: z.string().datetime('Horário programado inválido'),
  takenAt: z.string().datetime().optional().nullable(),
  skipped: z.boolean().optional().default(false),
  notes: z.string().optional().nullable(),
});

const logsQuerySchema = paginationSchema.extend({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const todayQuerySchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
});

// Routes
router.post('/', validateBody(createMedicationSchema), medicationController.create);
router.get('/', validateQuery(medicationQuerySchema), medicationController.getAll);
router.get('/today', validateQuery(todayQuerySchema), medicationController.getToday);
router.get('/:id', validateParams(uuidSchema), medicationController.getById);
router.put('/:id', validateParams(uuidSchema), validateBody(updateMedicationSchema), medicationController.update);
router.delete('/:id', validateParams(uuidSchema), medicationController.delete);

// Medication logs
router.post('/:id/log', validateParams(uuidSchema), validateBody(createLogSchema), medicationController.createLog);
router.get('/:id/logs', validateParams(uuidSchema), validateQuery(logsQuerySchema), medicationController.getLogs);

module.exports = router;
