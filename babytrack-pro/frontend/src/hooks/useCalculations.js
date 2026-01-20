import { useMemo } from 'react';
import { useBaby } from './useBaby';
import {
  calculateExpectedMilkVolume,
  calculateUrineThreshold,
  calculatePercentile,
  validateMilkIntake,
  validateUrineOutput,
  calculateGrowthVelocity
} from '../utils/calculation-helpers';
import omsData from '../data/oms-data.json';

/**
 * Hook to use calculation helpers with current baby context
 * @returns {Object} Calculation functions with baby context
 */
export const useCalculations = () => {
  const { currentBaby } = useBaby();

  /**
   * Get baby age in days
   */
  const ageInDays = useMemo(() => {
    if (!currentBaby?.birthDate) return 0;

    return Math.floor(
      (new Date() - new Date(currentBaby.birthDate)) / (1000 * 60 * 60 * 24)
    );
  }, [currentBaby]);

  /**
   * Get expected milk volume for current baby
   */
  const expectedMilkVolume = useMemo(() => {
    if (!currentBaby?.weight) return 0;

    return calculateExpectedMilkVolume(
      currentBaby.weight,
      ageInDays,
      currentBaby.constants || {}
    );
  }, [currentBaby, ageInDays]);

  /**
   * Get urine threshold for current baby
   */
  const urineThreshold = useMemo(() => {
    if (!currentBaby?.weight) return 0;

    return calculateUrineThreshold(currentBaby.weight, currentBaby.constants || {});
  }, [currentBaby]);

  /**
   * Calculate percentile for a measurement
   */
  const getPercentile = (metric, value, measurementDate = new Date()) => {
    if (!currentBaby) return null;

    return calculatePercentile(
      metric,
      value,
      currentBaby.sex,
      currentBaby.birthDate,
      measurementDate,
      omsData
    );
  };

  /**
   * Validate milk intake
   */
  const validateMilk = (volume) => {
    if (!currentBaby?.weight) return null;

    return validateMilkIntake(
      volume,
      currentBaby.weight,
      ageInDays,
      currentBaby.constants || {}
    );
  };

  /**
   * Validate urine output
   */
  const validateUrine = (volume) => {
    if (!currentBaby?.weight) return null;

    return validateUrineOutput(volume, currentBaby.weight, currentBaby.constants || {});
  };

  /**
   * Calculate growth velocity
   */
  const getGrowthVelocity = (measurements) => {
    if (!currentBaby || !measurements || measurements.length < 2) return null;

    return calculateGrowthVelocity(measurements);
  };

  /**
   * Get baby's current constants
   */
  const constants = useMemo(() => {
    return currentBaby?.constants || {};
  }, [currentBaby]);

  return {
    currentBaby,
    ageInDays,
    expectedMilkVolume,
    urineThreshold,
    constants,
    getPercentile,
    validateMilk,
    validateUrine,
    getGrowthVelocity
  };
};

export default useCalculations;
