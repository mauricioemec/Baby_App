// ===========================
// BabyTrack Pro - Backend Constants
// ===========================

// Feeding
const FEEDING_TYPES = {
  BREAST: 'breast',
  BOTTLE: 'bottle',
};

const BREAST_SIDES = {
  LEFT: 'left',
  RIGHT: 'right',
};

// Default ml/min for breastfeeding by age (months)
const DEFAULT_ML_PER_MIN_BREASTFEEDING = {
  '0-1': 5,
  '1-3': 6,
  '3-6': 7,
  '6+': 8,
};

// Default target ml/kg/day
const DEFAULT_ML_PER_KG_TARGET = 150;

// Diaper
const DIAPER_TYPES = {
  PEE: 'pee',
  POOP: 'poop',
  BOTH: 'both',
};

// Default diaper tare weight (grams)
const DEFAULT_DIAPER_TARE_WEIGHT = 30;

// Default pee target as percentage of weight
const PEE_TARGET_PERCENTAGE = 0.10; // 10% of theoretical weight

// Sex
const SEX = {
  MALE: 'male',
  FEMALE: 'female',
};

// OMS Percentiles
const PERCENTILES = ['P3', 'P15', 'P50', 'P85', 'P97'];
const DEFAULT_PERCENTILE = 'P50';

// Metrics for OMS calculations
const METRICS = {
  WEIGHT: 'weight',
  HEIGHT: 'height',
  HEAD_CIRCUMFERENCE: 'headCircumference',
};

// Symptom Types
const SYMPTOM_TYPES = {
  FEVER: 'fever',
  COLIC: 'colic',
  RASH: 'rash',
  CONGESTION: 'congestion',
  DIARRHEA: 'diarrhea',
  VOMITING: 'vomiting',
  OTHER: 'other',
};

// Symptom Severity
const SYMPTOM_SEVERITY = {
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
};

// Notification Types
const NOTIFICATION_TYPES = {
  FEEDING_REMINDER: 'feeding_reminder',
  MEDICATION_REMINDER: 'medication_reminder',
  LOW_INTAKE_ALERT: 'low_intake_alert',
};

// Default notification settings
const DEFAULT_FEEDING_REMINDER_HOURS = 3;
const LOW_INTAKE_CHECK_HOUR = 18; // 6 PM
const LOW_INTAKE_THRESHOLD = 0.70; // 70% of target
const MEDICATION_REMINDER_MINUTES_BEFORE = 5;

// Weight gain calculation
const MAX_DAYS_FOR_RECENT_WEIGHT = 15;
const RECENT_WEIGHT_GAIN_FACTOR = 0.25; // 25% real gain
const OMS_WEIGHT_GAIN_FACTOR = 0.75; // 75% OMS curve

// Validation
const VALIDATION = {
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
  OTP_EXPIRY_MINUTES: 10,
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
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
  VALIDATION,
  HTTP_STATUS,
};
