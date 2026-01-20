// ===========================
// BabyTrack Pro - Constants
// ===========================

// Feeding
export const FEEDING_TYPES = {
  BREAST: 'breast',
  BOTTLE: 'bottle'
};

export const BREAST_SIDES = {
  LEFT: 'left',
  RIGHT: 'right'
};

// Default ml/min for breastfeeding by age (months)
export const DEFAULT_ML_PER_MIN_BREASTFEEDING = {
  '0-1': 5,
  '1-3': 6,
  '3-6': 7,
  '6+': 8
};

// Default target ml/kg/day
export const DEFAULT_ML_PER_KG_TARGET = 150;

// Diaper
export const DIAPER_TYPES = {
  PEE: 'pee',
  POOP: 'poop',
  BOTH: 'both'
};

// Default diaper tare weight (grams)
export const DEFAULT_DIAPER_TARE_WEIGHT = 30;

// Default pee target as percentage of weight
export const PEE_TARGET_PERCENTAGE = 0.10; // 10% of theoretical weight

// Sex
export const SEX = {
  MALE: 'male',
  FEMALE: 'female'
};

// OMS Percentiles
export const PERCENTILES = ['P3', 'P15', 'P50', 'P85', 'P97'];
export const DEFAULT_PERCENTILE = 'P50';

// Metrics for OMS calculations
export const METRICS = {
  WEIGHT: 'weight',
  HEIGHT: 'height',
  HEAD_CIRCUMFERENCE: 'headCircumference'
};

// Symptom Types
export const SYMPTOM_TYPES = {
  FEVER: 'fever',
  COLIC: 'colic',
  RASH: 'rash',
  CONGESTION: 'congestion',
  DIARRHEA: 'diarrhea',
  VOMITING: 'vomiting',
  OTHER: 'other'
};

// Symptom Severity
export const SYMPTOM_SEVERITY = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  FEEDING_REMINDER: 'feeding_reminder',
  MEDICATION_REMINDER: 'medication_reminder',
  LOW_INTAKE_ALERT: 'low_intake_alert'
};

// Default notification settings
export const DEFAULT_FEEDING_REMINDER_HOURS = 3;
export const LOW_INTAKE_CHECK_HOUR = 18; // 6 PM
export const LOW_INTAKE_THRESHOLD = 0.70; // 70% of target
export const MEDICATION_REMINDER_MINUTES_BEFORE = 5;

// Weight gain calculation
export const MAX_DAYS_FOR_RECENT_WEIGHT = 15;
export const RECENT_WEIGHT_GAIN_FACTOR = 0.25; // 25% real gain
export const OMS_WEIGHT_GAIN_FACTOR = 0.75; // 75% OMS curve

// Languages
export const LANGUAGES = {
  PT: 'pt',
  EN: 'en',
  ES: 'es'
};

export const DEFAULT_LANGUAGE = LANGUAGES.PT;

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Chart colors
export const CHART_COLORS = {
  PRIMARY: '#60A5FA',
  SECONDARY: '#86EFAC',
  DANGER: '#F87171',
  SUCCESS: '#34D399',
  WARNING: '#FBBF24',
  OMS_CURVE: '#9CA3AF'
};

// Validation
export const VALIDATION = {
  MIN_WEIGHT: 500, // grams
  MAX_WEIGHT: 30000, // grams (30kg)
  MIN_HEIGHT: 30, // cm
  MAX_HEIGHT: 150, // cm
  MIN_HEAD_CIRCUMFERENCE: 20, // cm
  MAX_HEAD_CIRCUMFERENCE: 60, // cm
  MIN_FEEDING_VOLUME: 10, // ml
  MAX_FEEDING_VOLUME: 500, // ml
  MIN_FEEDING_DURATION: 1, // minutes
  MAX_FEEDING_DURATION: 120, // minutes
  MIN_DIAPER_WEIGHT: 10, // grams
  MAX_DIAPER_WEIGHT: 500, // grams
  MIN_TEMPERATURE: 35, // °C
  MAX_TEMPERATURE: 42, // °C
  PASSWORD_MIN_LENGTH: 6,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10
};

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  // Auth
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGIN: '/api/auth/login',
  AUTH_VERIFY_OTP: '/api/auth/verify-otp',
  AUTH_RESEND_OTP: '/api/auth/resend-otp',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_ME: '/api/auth/me',
  AUTH_CHANGE_PASSWORD: '/api/auth/change-password',

  // Baby
  BABY_CREATE: '/api/baby',
  BABY_GET: '/api/baby',
  BABY_UPDATE: '/api/baby/:id',
  BABY_DELETE: '/api/baby/:id',

  // Feeding
  FEEDING_CREATE: '/api/feeding',
  FEEDING_LIST: '/api/feeding',
  FEEDING_GET: '/api/feeding/:id',
  FEEDING_UPDATE: '/api/feeding/:id',
  FEEDING_DELETE: '/api/feeding/:id',
  FEEDING_STATS: '/api/feeding/stats',

  // Diaper
  DIAPER_CREATE: '/api/diaper',
  DIAPER_LIST: '/api/diaper',
  DIAPER_GET: '/api/diaper/:id',
  DIAPER_UPDATE: '/api/diaper/:id',
  DIAPER_DELETE: '/api/diaper/:id',
  DIAPER_STATS: '/api/diaper/stats',

  // Growth
  GROWTH_CREATE: '/api/growth',
  GROWTH_LIST: '/api/growth',
  GROWTH_GET: '/api/growth/:id',
  GROWTH_UPDATE: '/api/growth/:id',
  GROWTH_DELETE: '/api/growth/:id',
  GROWTH_LATEST: '/api/growth/latest',

  // Medication
  MEDICATION_CREATE: '/api/medication',
  MEDICATION_LIST: '/api/medication',
  MEDICATION_GET: '/api/medication/:id',
  MEDICATION_UPDATE: '/api/medication/:id',
  MEDICATION_DELETE: '/api/medication/:id',
  MEDICATION_LOG_CREATE: '/api/medication/:id/log',
  MEDICATION_LOG_LIST: '/api/medication/:id/logs',
  MEDICATION_TODAY: '/api/medication/today',

  // Symptom
  SYMPTOM_CREATE: '/api/symptom',
  SYMPTOM_LIST: '/api/symptom',
  SYMPTOM_GET: '/api/symptom/:id',
  SYMPTOM_UPDATE: '/api/symptom/:id',
  SYMPTOM_DELETE: '/api/symptom/:id',

  // FCM
  FCM_REGISTER: '/api/fcm/register',
  FCM_UNREGISTER: '/api/fcm/unregister'
};

// PWA
export const PWA_CONFIG = {
  APP_NAME: 'BabyTrack Pro',
  APP_SHORT_NAME: 'BabyTrack',
  THEME_COLOR: '#60A5FA',
  BACKGROUND_COLOR: '#F9FAFB'
};

// Errors
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  AUTH_ERROR: 'Erro de autenticação. Faça login novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  UNAUTHORIZED: 'Não autorizado.',
  FORBIDDEN: 'Acesso negado.'
};

export default {
  FEEDING_TYPES,
  BREAST_SIDES,
  DEFAULT_ML_PER_MIN_BREASTFEEDING,
  DEFAULT_ML_PER_KG_TARGET,
  DIAPER_TYPES,
  DEFAULT_DIAPER_TARE_WEIGHT,
  PEE_TARGET_PERCENTAGE,
  SEX,
  PERCENTILES,
  DEFAULT_PERCENTILE,
  METRICS,
  SYMPTOM_TYPES,
  SYMPTOM_SEVERITY,
  NOTIFICATION_TYPES,
  DEFAULT_FEEDING_REMINDER_HOURS,
  LOW_INTAKE_CHECK_HOUR,
  LOW_INTAKE_THRESHOLD,
  MEDICATION_REMINDER_MINUTES_BEFORE,
  MAX_DAYS_FOR_RECENT_WEIGHT,
  RECENT_WEIGHT_GAIN_FACTOR,
  OMS_WEIGHT_GAIN_FACTOR,
  LANGUAGES,
  DEFAULT_LANGUAGE,
  DATE_FORMAT,
  TIME_FORMAT,
  DATETIME_FORMAT,
  CHART_COLORS,
  VALIDATION,
  API_ENDPOINTS,
  PWA_CONFIG,
  ERROR_MESSAGES
};
