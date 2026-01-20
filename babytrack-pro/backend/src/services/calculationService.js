const { differenceInDays, differenceInMonths, parseISO } = require('date-fns');
const omsService = require('./omsService');
const {
  MAX_DAYS_FOR_RECENT_WEIGHT,
  RECENT_WEIGHT_GAIN_FACTOR,
  OMS_WEIGHT_GAIN_FACTOR,
  PEE_TARGET_PERCENTAGE,
  DEFAULT_ML_PER_KG_TARGET,
} = require('../utils/constants');

/**
 * Calculate chronological age in days and months
 * @param {Date|string} birthDate
 * @param {Date} currentDate
 * @returns {{days: number, months: number, years: number}}
 */
const calculateChronologicalAge = (birthDate, currentDate = new Date()) => {
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
const calculateCorrectedAge = (expectedDueDate, currentDate = new Date()) => {
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
const getEffectiveAge = (baby, currentDate = new Date()) => {
  const useCorrected = baby.useAdjustedAge && baby.expectedDueDate;

  if (useCorrected) {
    const age = calculateCorrectedAge(baby.expectedDueDate, currentDate);
    return { ...age, isCorrected: true };
  }

  const age = calculateChronologicalAge(baby.birthDate, currentDate);
  return { ...age, isCorrected: false };
};

/**
 * Calculate theoretical weight based on recent growth and OMS curve
 * @param {Object} baby
 * @param {Array} growthRecords - Sorted by date DESC
 * @param {Date} targetDate
 * @returns {number} - Weight in grams
 */
const calculateTheoreticalWeight = (baby, growthRecords, targetDate = new Date()) => {
  if (!growthRecords || growthRecords.length === 0) {
    // No records - use birth weight and OMS curve
    const age = getEffectiveAge(baby, targetDate);
    const omsWeight = omsService.getOMSValue(age.months, baby.sex, 'weight', baby.omsPercentile || 'P50');
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
      const latestOmsWeight = omsService.getOMSValue(latestAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');
      const targetOmsWeight = omsService.getOMSValue(targetAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');

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
  const omsWeight = omsService.getOMSValue(targetAge.months, baby.sex, 'weight', baby.omsPercentile || 'P50');

  return omsWeight ? omsWeight * 1000 : latestRecord.weightGrams;
};

/**
 * Convert breastfeeding duration to ml
 * @param {number} durationMinutes
 * @param {number} ageMonths
 * @param {Object} mlPerMinConfig - Baby's custom rates
 * @returns {number}
 */
const convertBreastfeedingToMl = (durationMinutes, ageMonths, mlPerMinConfig = null) => {
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
const calculateDailyMilkTarget = (theoreticalWeightGrams, mlPerKg = DEFAULT_ML_PER_KG_TARGET) => {
  const weightKg = theoreticalWeightGrams / 1000;
  return weightKg * mlPerKg;
};

/**
 * Calculate daily pee target (10% of theoretical weight)
 * @param {number} theoreticalWeightGrams
 * @returns {number} - Target in grams
 */
const calculateDailyPeeTarget = (theoreticalWeightGrams) => {
  return theoreticalWeightGrams * PEE_TARGET_PERCENTAGE;
};

/**
 * Calculate total feeding volume for a period
 * @param {Array} feedings
 * @param {Object} baby
 * @returns {number} - Total ml
 */
const calculateTotalFeedingVolume = (feedings, baby) => {
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
const calculateTotalPeeVolume = (diapers, tareWeight = 30) => {
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
const calculateTargetPercentage = (actual, target) => {
  if (target === 0) return 0;
  return Math.round((actual / target) * 100);
};

module.exports = {
  calculateChronologicalAge,
  calculateCorrectedAge,
  getEffectiveAge,
  calculateTheoreticalWeight,
  convertBreastfeedingToMl,
  calculateDailyMilkTarget,
  calculateDailyPeeTarget,
  calculateTotalFeedingVolume,
  calculateTotalPeeVolume,
  calculateTargetPercentage,
};
