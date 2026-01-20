import api from './api';

/**
 * Records Service - Handles feeding, diaper, and growth records
 */

// ========== FEEDING RECORDS ==========

/**
 * Create feeding record
 * @param {string} babyId - Baby ID
 * @param {Object} feedingData - Feeding data
 * @returns {Promise} Created feeding record
 */
export const createFeeding = async (babyId, feedingData) => {
  const response = await api.post(`/babies/${babyId}/feedings`, feedingData);
  return response.data;
};

/**
 * Get feeding records
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate, limit)
 * @returns {Promise} Array of feeding records
 */
export const getFeedings = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/feedings`, { params });
  return response.data;
};

/**
 * Get feeding by ID
 * @param {string} babyId - Baby ID
 * @param {string} feedingId - Feeding ID
 * @returns {Promise} Feeding record
 */
export const getFeeding = async (babyId, feedingId) => {
  const response = await api.get(`/babies/${babyId}/feedings/${feedingId}`);
  return response.data;
};

/**
 * Update feeding record
 * @param {string} babyId - Baby ID
 * @param {string} feedingId - Feeding ID
 * @param {Object} feedingData - Updated feeding data
 * @returns {Promise} Updated feeding record
 */
export const updateFeeding = async (babyId, feedingId, feedingData) => {
  const response = await api.put(`/babies/${babyId}/feedings/${feedingId}`, feedingData);
  return response.data;
};

/**
 * Delete feeding record
 * @param {string} babyId - Baby ID
 * @param {string} feedingId - Feeding ID
 * @returns {Promise} Response data
 */
export const deleteFeeding = async (babyId, feedingId) => {
  const response = await api.delete(`/babies/${babyId}/feedings/${feedingId}`);
  return response.data;
};

/**
 * Get feeding statistics
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise} Feeding statistics
 */
export const getFeedingStats = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/feedings/stats`, { params });
  return response.data;
};

// ========== DIAPER RECORDS ==========

/**
 * Create diaper record
 * @param {string} babyId - Baby ID
 * @param {Object} diaperData - Diaper data
 * @returns {Promise} Created diaper record
 */
export const createDiaper = async (babyId, diaperData) => {
  const response = await api.post(`/babies/${babyId}/diapers`, diaperData);
  return response.data;
};

/**
 * Get diaper records
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate, limit)
 * @returns {Promise} Array of diaper records
 */
export const getDiapers = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/diapers`, { params });
  return response.data;
};

/**
 * Get diaper by ID
 * @param {string} babyId - Baby ID
 * @param {string} diaperId - Diaper ID
 * @returns {Promise} Diaper record
 */
export const getDiaper = async (babyId, diaperId) => {
  const response = await api.get(`/babies/${babyId}/diapers/${diaperId}`);
  return response.data;
};

/**
 * Update diaper record
 * @param {string} babyId - Baby ID
 * @param {string} diaperId - Diaper ID
 * @param {Object} diaperData - Updated diaper data
 * @returns {Promise} Updated diaper record
 */
export const updateDiaper = async (babyId, diaperId, diaperData) => {
  const response = await api.put(`/babies/${babyId}/diapers/${diaperId}`, diaperData);
  return response.data;
};

/**
 * Delete diaper record
 * @param {string} babyId - Baby ID
 * @param {string} diaperId - Diaper ID
 * @returns {Promise} Response data
 */
export const deleteDiaper = async (babyId, diaperId) => {
  const response = await api.delete(`/babies/${babyId}/diapers/${diaperId}`);
  return response.data;
};

/**
 * Get diaper statistics
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise} Diaper statistics
 */
export const getDiaperStats = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/diapers/stats`, { params });
  return response.data;
};

// ========== GROWTH RECORDS ==========

/**
 * Create growth record
 * @param {string} babyId - Baby ID
 * @param {Object} growthData - Growth data
 * @returns {Promise} Created growth record with percentiles
 */
export const createGrowth = async (babyId, growthData) => {
  const response = await api.post(`/babies/${babyId}/growth`, growthData);
  return response.data;
};

/**
 * Get growth records
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate, limit)
 * @returns {Promise} Array of growth records
 */
export const getGrowthRecords = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/growth`, { params });
  return response.data;
};

/**
 * Get growth record by ID
 * @param {string} babyId - Baby ID
 * @param {string} growthId - Growth ID
 * @returns {Promise} Growth record
 */
export const getGrowth = async (babyId, growthId) => {
  const response = await api.get(`/babies/${babyId}/growth/${growthId}`);
  return response.data;
};

/**
 * Update growth record
 * @param {string} babyId - Baby ID
 * @param {string} growthId - Growth ID
 * @param {Object} growthData - Updated growth data
 * @returns {Promise} Updated growth record with percentiles
 */
export const updateGrowth = async (babyId, growthId, growthData) => {
  const response = await api.put(`/babies/${babyId}/growth/${growthId}`, growthData);
  return response.data;
};

/**
 * Delete growth record
 * @param {string} babyId - Baby ID
 * @param {string} growthId - Growth ID
 * @returns {Promise} Response data
 */
export const deleteGrowth = async (babyId, growthId) => {
  const response = await api.delete(`/babies/${babyId}/growth/${growthId}`);
  return response.data;
};

/**
 * Get growth chart data
 * @param {string} babyId - Baby ID
 * @param {string} metric - Metric (weight, height, headCircumference)
 * @returns {Promise} Chart data with OMS curves
 */
export const getGrowthChart = async (babyId, metric = 'weight') => {
  const response = await api.get(`/babies/${babyId}/growth/chart/${metric}`);
  return response.data;
};

export default {
  // Feeding
  createFeeding,
  getFeedings,
  getFeeding,
  updateFeeding,
  deleteFeeding,
  getFeedingStats,

  // Diaper
  createDiaper,
  getDiapers,
  getDiaper,
  updateDiaper,
  deleteDiaper,
  getDiaperStats,

  // Growth
  createGrowth,
  getGrowthRecords,
  getGrowth,
  updateGrowth,
  deleteGrowth,
  getGrowthChart
};
