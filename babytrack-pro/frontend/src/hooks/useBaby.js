import { useContext } from 'react';
import { BabyContext } from '../contexts/BabyContext';

/**
 * Hook to use Baby Context
 * @returns {Object} Baby context value
 */
export const useBaby = () => {
  const context = useContext(BabyContext);

  if (!context) {
    throw new Error('useBaby must be used within a BabyProvider');
  }

  return context;
};

export default useBaby;
