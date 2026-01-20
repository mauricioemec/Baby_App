import { createContext, useState, useEffect, useCallback } from 'react';
import * as babyService from '../services/babyService';
import * as recordsService from '../services/recordsService';
import {
  calculateDailyMilkTarget,
  calculateDailyPeeTarget,
  calculatePercentile
} from '../utils/calculation-helpers';
import omsData from '../data/oms-data.json';

export const BabyContext = createContext();

export const BabyProvider = ({ children }) => {
  const [babies, setBabies] = useState([]);
  const [currentBaby, setCurrentBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Load babies on mount
  useEffect(() => {
    loadBabies();
  }, []);

  // Load stats when current baby changes
  useEffect(() => {
    if (currentBaby) {
      loadStats(currentBaby._id);
    }
  }, [currentBaby]);

  /**
   * Load all babies
   */
  const loadBabies = async () => {
    try {
      setLoading(true);
      const data = await babyService.getBabies();

      setBabies(data.babies || []);

      // Set first baby as current if exists
      if (data.babies && data.babies.length > 0) {
        const savedBabyId = localStorage.getItem('babytrack_current_baby');
        const baby = savedBabyId
          ? data.babies.find(b => b._id === savedBabyId)
          : data.babies[0];

        setCurrentBaby(baby || data.babies[0]);
      }
    } catch (error) {
      console.error('Error loading babies:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load stats for baby
   */
  const loadStats = async (babyId, period = 'today') => {
    try {
      const data = await babyService.getBabyStats(babyId, period);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  /**
   * Create new baby
   */
  const createBaby = async (babyData) => {
    try {
      const data = await babyService.createBaby(babyData);

      setBabies(prev => [...prev, data.baby]);
      setCurrentBaby(data.baby);
      localStorage.setItem('babytrack_current_baby', data.baby._id);

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Update baby
   */
  const updateBaby = async (babyId, babyData) => {
    try {
      const data = await babyService.updateBaby(babyId, babyData);

      setBabies(prev => prev.map(b => (b._id === babyId ? data.baby : b)));

      if (currentBaby && currentBaby._id === babyId) {
        setCurrentBaby(data.baby);
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Delete baby
   */
  const deleteBaby = async (babyId) => {
    try {
      await babyService.deleteBaby(babyId);

      setBabies(prev => prev.filter(b => b._id !== babyId));

      if (currentBaby && currentBaby._id === babyId) {
        const remaining = babies.filter(b => b._id !== babyId);
        setCurrentBaby(remaining.length > 0 ? remaining[0] : null);

        if (remaining.length > 0) {
          localStorage.setItem('babytrack_current_baby', remaining[0]._id);
        } else {
          localStorage.removeItem('babytrack_current_baby');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Switch current baby
   */
  const switchBaby = (babyId) => {
    const baby = babies.find(b => b._id === babyId);

    if (baby) {
      setCurrentBaby(baby);
      localStorage.setItem('babytrack_current_baby', babyId);
    }
  };

  /**
   * Refresh current baby data
   */
  const refreshBaby = async () => {
    if (currentBaby) {
      try {
        const data = await babyService.getBaby(currentBaby._id);

        setBabies(prev => prev.map(b => (b._id === currentBaby._id ? data.baby : b)));
        setCurrentBaby(data.baby);

        return data.baby;
      } catch (error) {
        console.error('Error refreshing baby:', error);
        throw error;
      }
    }
  };

  /**
   * Refresh stats
   */
  const refreshStats = useCallback(async (period = 'today') => {
    if (currentBaby) {
      await loadStats(currentBaby._id, period);
    }
  }, [currentBaby]);

  /**
   * Get calculations for current baby
   */
  const getCalculations = useCallback(() => {
    if (!currentBaby) return null;

    const ageInDays = Math.floor(
      (new Date() - new Date(currentBaby.birthDate)) / (1000 * 60 * 60 * 24)
    );

    const expectedMilk = calculateDailyMilkTarget(
      currentBaby.weight || currentBaby.birthWeight,
      currentBaby.mlPerKgTarget || 150
    );

    const urineThreshold = calculateDailyPeeTarget(
      currentBaby.weight || currentBaby.birthWeight
    );

    return {
      ageInDays,
      expectedMilkVolume: expectedMilk,
      urineThreshold
    };
  }, [currentBaby]);

  /**
   * Calculate percentile for measurement
   */
  const calculateBabyPercentile = useCallback(
    (metric, value, measurementDate = new Date()) => {
      if (!currentBaby) return null;

      return calculatePercentile(
        metric,
        value,
        currentBaby.sex,
        currentBaby.birthDate,
        measurementDate,
        omsData
      );
    },
    [currentBaby]
  );

  const value = {
    babies,
    currentBaby,
    loading,
    stats,
    createBaby,
    updateBaby,
    deleteBaby,
    switchBaby,
    refreshBaby,
    loadBabies,
    refreshStats,
    getCalculations,
    calculateBabyPercentile
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};
