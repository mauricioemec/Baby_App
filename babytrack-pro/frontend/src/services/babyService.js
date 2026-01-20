import api from './api';

/**
 * Baby Service - Handles baby-related operations
 */

/**
 * Create a new baby profile
 * @param {Object} babyData - Baby data
 * @returns {Promise} Created baby
 */
export const createBaby = async (babyData) => {
  const response = await api.post('/babies', babyData);
  return response.data;
};

/**
 * Get all babies for current user
 * @returns {Promise} Array of babies
 */
export const getBabies = async () => {
  const response = await api.get('/babies');
  return response.data;
};

/**
 * Get baby by ID
 * @param {string} babyId - Baby ID
 * @returns {Promise} Baby data
 */
export const getBaby = async (babyId) => {
  const response = await api.get(`/babies/${babyId}`);
  return response.data;
};

/**
 * Update baby profile
 * @param {string} babyId - Baby ID
 * @param {Object} babyData - Updated baby data
 * @returns {Promise} Updated baby
 */
export const updateBaby = async (babyId, babyData) => {
  const response = await api.put(`/babies/${babyId}`, babyData);
  return response.data;
};

/**
 * Delete baby
 * @param {string} babyId - Baby ID
 * @returns {Promise} Response data
 */
export const deleteBaby = async (babyId) => {
  const response = await api.delete(`/babies/${babyId}`);
  return response.data;
};

/**
 * Get baby statistics
 * @param {string} babyId - Baby ID
 * @param {string} period - Period (today, week, month)
 * @returns {Promise} Statistics data
 */
export const getBabyStats = async (babyId, period = 'today') => {
  const response = await api.get(`/babies/${babyId}/stats`, {
    params: { period }
  });
  return response.data;
};

/**
 * Get baby's growth data
 * @param {string} babyId - Baby ID
 * @returns {Promise} Growth data array
 */
export const getBabyGrowth = async (babyId) => {
  const response = await api.get(`/babies/${babyId}/growth`);
  return response.data;
};

export default {
  createBaby,
  getBabies,
  getBaby,
  updateBaby,
  deleteBaby,
  getBabyStats,
  getBabyGrowth
};
