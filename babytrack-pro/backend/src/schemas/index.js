const { z } = require('zod');
const { VALIDATION, SEX, PERCENTILES, FEEDING_TYPES, BREAST_SIDES, DIAPER_TYPES, SYMPTOM_TYPES, SYMPTOM_SEVERITY } = require('../utils/constants');

// ==================== AUTH SCHEMAS ====================

const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `Senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(VALIDATION.OTP_LENGTH, `Código deve ter ${VALIDATION.OTP_LENGTH} dígitos`),
});

// ==================== BABY SCHEMAS ====================

const createBabySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  sex: z.enum([SEX.MALE, SEX.FEMALE]),
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

// ==================== FEEDING SCHEMAS ====================

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

// ==================== DIAPER SCHEMAS ====================

const createDiaperSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum([DIAPER_TYPES.PEE, DIAPER_TYPES.POOP, DIAPER_TYPES.BOTH]),
  weightGrams: z.number().min(VALIDATION.MIN_DIAPER_WEIGHT).max(VALIDATION.MAX_DIAPER_WEIGHT).optional().nullable(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
});

// ==================== GROWTH SCHEMAS ====================

const createGrowthSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  weightGrams: z.number().min(VALIDATION.MIN_WEIGHT).max(VALIDATION.MAX_WEIGHT),
  heightCm: z.number().min(VALIDATION.MIN_HEIGHT).max(VALIDATION.MAX_HEIGHT),
  headCircumferenceCm: z.number().min(VALIDATION.MIN_HEAD_CIRCUMFERENCE).max(VALIDATION.MAX_HEAD_CIRCUMFERENCE).optional().nullable(),
  timestamp: z.string().datetime().optional(),
  notes: z.string().optional().nullable(),
});

// ==================== MEDICATION SCHEMAS ====================

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

// ==================== SYMPTOM SCHEMAS ====================

const createSymptomSchema = z.object({
  babyId: z.string().uuid('Baby ID inválido'),
  type: z.enum(Object.values(SYMPTOM_TYPES)),
  severity: z.enum(Object.values(SYMPTOM_SEVERITY)),
  description: z.string().min(1, 'Descrição é obrigatória'),
  temperature: z.number().min(VALIDATION.MIN_TEMPERATURE).max(VALIDATION.MAX_TEMPERATURE).optional().nullable(),
  timestamp: z.string().datetime().optional(),
});

module.exports = {
  signupSchema,
  loginSchema,
  verifyOtpSchema,
  createBabySchema,
  createFeedingSchema,
  createDiaperSchema,
  createGrowthSchema,
  createMedicationSchema,
  createSymptomSchema,
};
