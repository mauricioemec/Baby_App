// ===========================
// BabyTrack Pro - Calculation Helpers
// ===========================

import { differenceInDays, differenceInMonths, parseISO } from 'date-fns';
import omsData from '../data/oms-data.json';
import {
  MAX_DAYS_FOR_RECENT_WEIGHT,
  RECENT_WEIGHT_GAIN_FACTOR,
  OMS_WEIGHT_GAIN_FACTOR,
  PEE_TARGET_PERCENTAGE
} from './constants';

/**
 * Calculate chronological age in days and months
 * @param {Date|string} birthDate
 * @param {Date} currentDate
 * @returns {{days: number, months: number, years: number}}
 */
export const calculateChronologicalAge = (birthDate, currentDate = new Date()) => {
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  const days = differenceInDays(currentDate, birth);
  const months = differenceInMonths(currentDate, birth);
  const years = Math.floor(months / 12);

  return { days, months, years };
};

/**
 * Calculate corrected age for premature babies
 * @param {Date|string} expectedDueDate - DPP
 * @param {Date} currentDate
 * @returns {{days: number, months: number, years: number}}
 */
export const calculateCorrectedAge = (expectedDueDate, currentDate = new Date()) => {
  const dueDate = typeof expectedDueDate === 'string' ? parseISO(expectedDueDate) : expectedDueDate;
  const days = differenceInDays(currentDate, dueDate);
  const months = Math.max(0, differenceInMonths(currentDate, dueDate));
  const years = Math.floor(months / 12);

  return { days, months, years };
};

/**
 * Determine which age to use based on baby settings
 * @param {Object} baby
 * @param {Date} currentDate
 * @returns {{days: number, months: number, years: number, isCorrected: boolean}}
 */
export const getEffectiveAge = (baby, currentDate = new Date()) => {
  const useCorrected = baby.useAdjustedAge && baby.expectedDueDate;

  if (useCorrected) {
    const age = calculateCorrectedAge(baby.expectedDueDate, currentDate);
    return { ...age, isCorrected: true };
  }

  const age = calculateChronologicalAge(baby.birthDate, currentDate);
  return { ...age, isCorrected: false };
};

/**
 * Linear interpolation between two points
 * @param {number} x
 * @param {number} x0
 * @param {number} x1
 * @param {number} y0
 * @param {number} y1
 * @returns {number}
 */
const interpolate = (x, x0, x1, y0, y1) => {
  if (x1 === x0) return y0;
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

/**
 * Get OMS value for a specific age, sex, metric and percentile with interpolation
 * @param {number} ageMonths
 * @param {string} sex - "male" or "female"
 * @param {string} metric - "weight", "height", "headCircumference"
 * @param {string} percentile - "P3", "P15", "P50", "P85", "P97"
 * @returns {number|null}
 */
export const getOMSValue = (ageMonths, sex, metric, percentile) => {
  const data = omsData[metric]?.[sex];
  if (!data) return null;

  const availableAges = Object.keys(data).map(Number).sort((a, b) => a - b);

  // If exact age exists
  if (data[ageMonths]) {
    return data[ageMonths][percentile];
  }

  // Find surrounding ages for interpolation
  let lowerAge = null;
  let upperAge = null;

  for (let i = 0; i < availableAges.length - 1; i++) {
    if (ageMonths >= availableAges[i] && ageMonths <= availableAges[i + 1]) {
      lowerAge = availableAges[i];
      upperAge = availableAges[i + 1];
      break;
    }
  }

  // If out of range, use nearest
  if (!lowerAge && !upperAge) {
    if (ageMonths < availableAges[0]) {
      return data[availableAges[0]][percentile];
    }
    return data[availableAges[availableAges.length - 1]][percentile];
  }

  // Interpolate
  const lowerValue = data[lowerAge][percentile];
  const upperValue = data[upperAge][percentile];

  return interpolate(ageMonths, lowerAge, upperAge, lowerValue, upperValue);
};

/**
 * Calculate which percentile a value falls into
 * @param {number} value
 * @param {number} ageMonths
 * @param {string} sex
 * @param {string} metric
 * @returns {string|null} - "P3", "P15", "P50", "P85", "P97", "<P3", ">P97"
 */
export const calculatePercentile = (value, ageMonths, sex, metric) => {
  const percentiles = ['P3', 'P15', 'P50', 'P85', 'P97'];
  const values = percentiles.map(p => getOMSValue(ageMonths, sex, metric, p));

  if (values.some(v => v === null)) return null;

  // Below P3
  if (value < values[0]) return '<P3';

  // Above P97
  if (value > values[4]) return '>P97';

  // Find exact or between percentiles
  for (let i = 0; i < values.length; i++) {
    if (Math.abs(value - values[i]) < 0.1) {
      return percentiles[i];
    }
  }

  // Between percentiles - return the lower one
  for (let i = 0; i < values.length - 1; i++) {
    if (value >= values[i] && value <= values[i + 1]) {
      // Closer to which one?
      const distToLower = Math.abs(value - values[i]);
      const distToUpper = Math.abs(value - values[i + 1]);
      return distToLower <= distToUpper ? percentiles[i] : percentiles[i + 1];
    }
  }

  return 'P50'; // Default fallback
};

/**
 * Calculate theoretical weight based on recent growth and OMS curve
 * @param {Object} baby
 * @param {Array} growthRecords - Sorted by date DESC
 * @param {Date} targetDate
 * @returns {number} - Weight in grams
 */
export const calculateTheoreticalWeight = (baby, growthRecords, targetDate = new Date()) => {
  if (!growthRecords || growthRecords.length === 0) {
    // No records - use birth weight and OMS curve
    const age = getEffectiveAge(baby, targetDate);
    const birthWeightKg = baby.birthWeight / 1000;
    const omsWeight = getOMSValue(age.months, baby.sex, 'weight', baby.omsPercentile || 'P50');
    return omsWeight ? omsWeight * 1000 : baby.birthWeight;
  }

  const latestRecord = growthRecords[0];
  const latestDate = typeof latestRecord.timestamp === 'string'
    ? parseISO(latestRecord.timestamp)
    : latestRecord.timestamp;
  const daysSinceLastWeight = differenceInDays(targetDate, latestDate);

  // If recent weight (≤ 15 days), use hybrid calculation
  if (daysSinceLastWeight <= MAX_DAYS_FOR_RECENT_WEIGHT && growthRecords.length >= 2) {
    const previousRecord = growthRecords[1];
    const previousDate = typeof previousRecord.timestamp === 'string'
      ? parseISO(previousRecord.timestamp)
      : previousRecord.timestamp;

    const daysBetweenWeights = differenceInDays(latestDate, previousDate);

    if (daysBetweenWeights > 0) {
      // Real weight gain per day
      const realGainPerDay = (latestRecord.weightGrams - previousRecord.weightGrams) / daysBetweenWeights;

      // OMS expected gain per day
      const latestAge = getEffectiveAge(baby, latestDate);
      const targetAge = getEffectiveAge(baby, targetDate);
      const latestOmsWeight = getOMSValue(latestAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');
      const targetOmsWeight = getOMSValue(targetAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');

      if (latestOmsWeight && targetOmsWeight) {
        const omsGainPerDay = ((targetOmsWeight - latestOmsWeight) * 1000) / Math.max(1, daysSinceLastWeight);

        // Hybrid: 25% real + 75% OMS
        const hybridGainPerDay = (realGainPerDay * RECENT_WEIGHT_GAIN_FACTOR) +
                                 (omsGainPerDay * OMS_WEIGHT_GAIN_FACTOR);

        return latestRecord.weightGrams + (hybridGainPerDay * daysSinceLastWeight);
      }
    }
  }

  // Use OMS curve only
  const targetAge = getEffectiveAge(baby, targetDate);
  const omsWeight = getOMSValue(targetAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');

  return omsWeight ? omsWeight * 1000 : latestRecord.weightGrams;
};

/**
 * Convert breastfeeding duration to ml
 * @param {number} durationMinutes
 * @param {number} ageMonths
 * @param {Object} mlPerMinConfig - Baby's custom rates
 * @returns {number}
 */
export const convertBreastfeedingToMl = (durationMinutes, ageMonths, mlPerMinConfig = null) => {
  // Default rates
  let rate = 5; // 0-1 months

  if (ageMonths >= 6) rate = 8;
  else if (ageMonths >= 3) rate = 7;
  else if (ageMonths >= 1) rate = 6;

  // Use custom rates if provided
  if (mlPerMinConfig) {
    if (ageMonths < 1 && mlPerMinConfig['0-1']) rate = mlPerMinConfig['0-1'];
    else if (ageMonths >= 1 && ageMonths < 3 && mlPerMinConfig['1-3']) rate = mlPerMinConfig['1-3'];
    else if (ageMonths >= 3 && ageMonths < 6 && mlPerMinConfig['3-6']) rate = mlPerMinConfig['3-6'];
    else if (ageMonths >= 6 && mlPerMinConfig['6+']) rate = mlPerMinConfig['6+'];
  }

  return durationMinutes * rate;
};

/**
 * Calculate daily milk target
 * @param {number} theoreticalWeightGrams
 * @param {number} mlPerKg - From baby settings
 * @returns {number} - Target in ml
 */
export const calculateDailyMilkTarget = (theoreticalWeightGrams, mlPerKg = 150) => {
  const weightKg = theoreticalWeightGrams / 1000;
  return weightKg * mlPerKg;
};

/**
 * Calculate daily pee target (10% of theoretical weight)
 * @param {number} theoreticalWeightGrams
 * @returns {number} - Target in grams
 */
export const calculateDailyPeeTarget = (theoreticalWeightGrams) => {
  return theoreticalWeightGrams * PEE_TARGET_PERCENTAGE;
};

/**
 * Calculate total feeding volume for a period
 * @param {Array} feedings
 * @param {Object} baby
 * @returns {number} - Total ml
 */
export const calculateTotalFeedingVolume = (feedings, baby) => {
  return feedings.reduce((total, feeding) => {
    if (feeding.type === 'bottle') {
      return total + (feeding.volumeMl || 0);
    }

    if (feeding.type === 'breast' && feeding.duration) {
      const feedingDate = typeof feeding.timestamp === 'string'
        ? parseISO(feeding.timestamp)
        : feeding.timestamp;
      const age = getEffectiveAge(baby, feedingDate);
      const ml = convertBreastfeedingToMl(
        feeding.duration,
        age.months,
        baby.mlPerMinBreastfeeding
      );
      return total + ml;
    }

    return total;
  }, 0);
};

/**
 * Calculate total pee volume for a period
 * @param {Array} diapers
 * @param {number} tareWeight - Diaper tare weight in grams
 * @returns {number} - Total grams
 */
export const calculateTotalPeeVolume = (diapers, tareWeight = 30) => {
  return diapers.reduce((total, diaper) => {
    if ((diaper.type === 'pee' || diaper.type === 'both') && diaper.weightGrams) {
      const peeWeight = diaper.weightGrams - tareWeight;
      return total + Math.max(0, peeWeight);
    }
    return total;
  }, 0);
};

/**
 * Calculate percentage of target achieved
 * @param {number} actual
 * @param {number} target
 * @returns {number} - Percentage (0-100+)
 */
export const calculateTargetPercentage = (actual, target) => {
  if (target === 0) return 0;
  return Math.round((actual / target) * 100);
};

/**
 * Format age as human-readable string
 * @param {{days: number, months: number, years: number}} age
 * @param {string} lang - 'pt', 'en', 'es'
 * @returns {string}
 */
export const formatAge = (age, lang = 'pt') => {
  const { years, months, days } = age;

  const translations = {
    pt: {
      year: 'ano',
      years: 'anos',
      month: 'mês',
      months: 'meses',
      day: 'dia',
      days: 'dias',
      and: 'e'
    },
    en: {
      year: 'year',
      years: 'years',
      month: 'month',
      months: 'months',
      day: 'day',
      days: 'days',
      and: 'and'
    },
    es: {
      year: 'año',
      years: 'años',
      month: 'mes',
      months: 'meses',
      day: 'día',
      days: 'días',
      and: 'y'
    }
  };

  const t = translations[lang] || translations.pt;
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? t.year : t.years}`);
  }

  if (months > 0 || (years > 0 && days > 0)) {
    const remainingMonths = months % 12;
    if (remainingMonths > 0 || years === 0) {
      parts.push(`${remainingMonths || months} ${(remainingMonths || months) === 1 ? t.month : t.months}`);
    }
  }

  if (days > 0 && years === 0) {
    const remainingDays = days % 30;
    if (remainingDays > 0 || months === 0) {
      parts.push(`${remainingDays || days} ${(remainingDays || days) === 1 ? t.day : t.days}`);
    }
  }

  if (parts.length === 0) return `0 ${t.days}`;
  if (parts.length === 1) return parts[0];

  const last = parts.pop();
  return `${parts.join(', ')} ${t.and} ${last}`;
};

/**
 * Determine color code based on target percentage
 * @param {number} percentage
 * @returns {string} - 'success', 'warning', 'danger'
 */
export const getTargetColorCode = (percentage) => {
  if (percentage >= 100) return 'success';
  if (percentage >= 80) return 'warning';
  return 'danger';
};

export default {
  calculateChronologicalAge,
  calculateCorrectedAge,
  getEffectiveAge,
  getOMSValue,
  calculatePercentile,
  calculateTheoreticalWeight,
  convertBreastfeedingToMl,
  calculateDailyMilkTarget,
  calculateDailyPeeTarget,
  calculateTotalFeedingVolume,
  calculateTotalPeeVolume,
  calculateTargetPercentage,
  formatAge,
  getTargetColorCode
};
