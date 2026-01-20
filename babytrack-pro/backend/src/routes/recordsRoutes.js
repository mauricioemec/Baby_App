const express = require('express');
const { z } = require('zod');
const feedingController = require('../controllers/feedingController');
const diaperController = require('../controllers/diaperController');
const growthController = require('../controllers/growthController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody, validateParams, validateQuery, uuidSchema, paginationSchema } = require('../middleware/validator');
const { VALIDATION, FEEDING_TYPES, BREAST_SIDES, DIAPER_TYPES } = require('../utils/constants');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// ==================== FEEDING ROUTES ====================

const createFeedingSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum([FEEDING_TYPES.BREAST, FEEDING_TYPES.BOTTLE]),
  side: z.enum([BREAST_SIDES.LEFT, BREAST_SIDES.RIGHT]).optional().nullable(),
  duration: z.number().min(VALIDATION.MIN_FEEDING_DURATION).max(VALIDATION.MAX_FEEDING_DURATION).optional().nullable(),
  volumeMl: z.number().min(VALIDATION.MIN_FEEDING_VOLUME).max(VALIDATION.MAX_FEEDING_VOLUME).optional().nullable(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
}).refine(
  (data) => {
    if (data.type === FEEDING_TYPES.BREAST) {
      return data.duration !== null && data.duration !== undefined;
    }
    if (data.type === FEEDING_TYPES.BOTTLE) {
      return data.volumeMl !== null && data.volumeMl !== undefined;
    }
    return true;
  },
  {
    message: 'Para mamadas no peito, a duração é obrigatória. Para mamadeiras, o volume é obrigatório.',
  }
);

const updateFeedingSchema = createFeedingSchema.omit({ babyId: true }).partial();

const feedingQuerySchema = paginationSchema.extend({
  babyId: z.string().uuid('Baby ID inválido'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const feedingStatsQuerySchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  date: z.string().datetime().optional(),
});

router.post('/feeding', validateBody(createFeedingSchema), feedingController.create);
router.get('/feeding', validateQuery(feedingQuerySchema), feedingController.getAll);
router.get('/feeding/stats', validateQuery(feedingStatsQuerySchema), feedingController.getStats);
router.get('/feeding/:id', validateParams(uuidSchema), feedingController.getById);
router.put('/feeding/:id', validateParams(uuidSchema), validateBody(updateFeedingSchema), feedingController.update);
router.delete('/feeding/:id', validateParams(uuidSchema), feedingController.delete);

// ==================== DIAPER ROUTES ====================

const createDiaperSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum([DIAPER_TYPES.PEE, DIAPER_TYPES.POOP, DIAPER_TYPES.BOTH]),
  weightGrams: z.number().min(VALIDATION.MIN_DIAPER_WEIGHT).max(VALIDATION.MAX_DIAPER_WEIGHT).optional().nullable(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
});

const updateDiaperSchema = createDiaperSchema.omit({ babyId: true }).partial();

const diaperQuerySchema = paginationSchema.extend({
  babyId: z.string().uuid('Baby ID inválido'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const diaperStatsQuerySchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  date: z.string().datetime().optional(),
});

router.post('/diaper', validateBody(createDiaperSchema), diaperController.create);
router.get('/diaper', validateQuery(diaperQuerySchema), diaperController.getAll);
router.get('/diaper/stats', validateQuery(diaperStatsQuerySchema), diaperController.getStats);
router.get('/diaper/:id', validateParams(uuidSchema), diaperController.getById);
router.put('/diaper/:id', validateParams(uuidSchema), validateBody(updateDiaperSchema), diaperController.update);
router.delete('/diaper/:id', validateParams(uuidSchema), diaperController.delete);

// ==================== GROWTH ROUTES ====================

const createGrowthSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  weightGrams: z.number().min(VALIDATION.MIN_WEIGHT).max(VALIDATION.MAX_WEIGHT),
  heightCm: z.number().min(VALIDATION.MIN_HEIGHT).max(VALIDATION.MAX_HEIGHT),
  headCircumferenceCm: z.number().min(VALIDATION.MIN_HEAD_CIRCUMFERENCE).max(VALIDATION.MAX_HEAD_CIRCUMFERENCE).optional().nullable(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
});

const updateGrowthSchema = createGrowthSchema.omit({ babyId: true }).partial();

const growthQuerySchema = paginationSchema.extend({
  babyId: z.string().uuid('Baby ID inválido'),
});

const growthLatestQuerySchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
});

router.post('/growth', validateBody(createGrowthSchema), growthController.create);
router.get('/growth', validateQuery(growthQuerySchema), growthController.getAll);
router.get('/growth/latest', validateQuery(growthLatestQuerySchema), growthController.getLatest);
router.get('/growth/:id', validateParams(uuidSchema), growthController.getById);
router.put('/growth/:id', validateParams(uuidSchema), validateBody(updateGrowthSchema), growthController.update);
router.delete('/growth/:id', validateParams(uuidSchema), growthController.delete);

module.exports = router;
