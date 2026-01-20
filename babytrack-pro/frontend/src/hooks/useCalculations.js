import { useMemo } from 'react';
import { useBaby } from './useBaby';
import {
  calculateChronologicalAge,
  calculateCorrectedAge,
  getEffectiveAge,
  calculatePercentile,
  calculateTheoreticalWeight,
  convertBreastfeedingToMl,
  calculateDailyMilkTarget,
  calculateDailyPeeTarget,
  calculateTotalFeedingVolume,
  calculateTotalPeeVolume,
  calculateTargetPercentage,
  formatAge,
  getTargetColorCode,
  getOMSValue
} from '../utils/calculation-helpers';

/**
 * Hook to use calculation helpers with current baby context
 * @returns {Object} Calculation functions with baby context
 */
export const useCalculations = () => {
  const { currentBaby } = useBaby();

  /**
   * Get baby effective age (chronological or corrected)
   */
  const effectiveAge = useMemo(() => {
    if (!currentBaby) return null;
    return getEffectiveAge(currentBaby);
  }, [currentBaby]);

  /**
   * Get theoretical weight for current baby
   */
  const theoreticalWeight = useMemo(() => {
    if (!currentBaby) return 0;
    // This would need growth records, for now return last recorded weight or birth weight
    return currentBaby.lastWeight || currentBaby.birthWeight || 0;
  }, [currentBaby]);

  /**
   * Get expected milk volume for current baby
   */
  const expectedMilkVolume = useMemo(() => {
    if (!theoreticalWeight) return 0;
    return calculateDailyMilkTarget(theoreticalWeight, currentBaby?.mlPerKgTarget || 150);
  }, [theoreticalWeight, currentBaby]);

  /**
   * Get pee threshold for current baby
   */
  const peeThreshold = useMemo(() => {
    if (!theoreticalWeight) return 0;
    return calculateDailyPeeTarget(theoreticalWeight);
  }, [theoreticalWeight]);

  /**
   * Calculate percentile for a measurement
   */
  const getPercentile = (value, metric) => {
    if (!currentBaby || !effectiveAge) return null;
    return calculatePercentile(value, effectiveAge.months, currentBaby.sex, metric);
  };

  /**
   * Convert breastfeeding duration to ml
   */
  const breastfeedingToMl = (durationMinutes) => {
    if (!currentBaby || !effectiveAge) return 0;
    return convertBreastfeedingToMl(
      durationMinutes,
      effectiveAge.months,
      currentBaby.mlPerMinBreastfeeding
    );
  };

  /**
   * Calculate total feeding volume for a list of feedings
   */
  const getTotalFeedingVolume = (feedings) => {
    if (!currentBaby || !feedings) return 0;
    return calculateTotalFeedingVolume(feedings, currentBaby);
  };

  /**
   * Calculate total pee volume for a list of diapers
   */
  const getTotalPeeVolume = (diapers) => {
    if (!currentBaby || !diapers) return 0;
    return calculateTotalPeeVolume(diapers, currentBaby.diaperTareWeight || 30);
  };

  /**
   * Calculate percentage achieved of target
   */
  const getTargetPercentage = (actual, target) => {
    return calculateTargetPercentage(actual, target);
  };

  /**
   * Get color code based on percentage
   */
  const getColorCode = (percentage) => {
    return getTargetColorCode(percentage);
  };

  /**
   * Format age as human-readable string
   */
  const formatBabyAge = (lang = 'pt') => {
    if (!effectiveAge) return '';
    return formatAge(effectiveAge, lang);
  };

  /**
   * Get OMS value for specific parameters
   */
  const getOMSReference = (ageMonths, metric, percentile) => {
    if (!currentBaby) return null;
    return getOMSValue(ageMonths, currentBaby.sex, metric, percentile);
  };

  return {
    currentBaby,
    effectiveAge,
    theoreticalWeight,
    expectedMilkVolume,
    peeThreshold,
    getPercentile,
    breastfeedingToMl,
    getTotalFeedingVolume,
    getTotalPeeVolume,
    getTargetPercentage,
    getColorCode,
    formatBabyAge,
    getOMSReference
  };
};

export default useCalculations;
