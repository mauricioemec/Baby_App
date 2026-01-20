import api from './api';

/**
 * Symptom Service - Handles symptom tracking
 */

/**
 * Create symptom record
 * @param {string} babyId - Baby ID
 * @param {Object} symptomData - Symptom data
 * @returns {Promise} Created symptom record
 */
export const createSymptom = async (babyId, symptomData) => {
  const response = await api.post(`/babies/${babyId}/symptoms`, symptomData);
  return response.data;
};

/**
 * Get symptom records
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate, type, limit)
 * @returns {Promise} Array of symptom records
 */
export const getSymptoms = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/symptoms`, { params });
  return response.data;
};

/**
 * Get symptom by ID
 * @param {string} babyId - Baby ID
 * @param {string} symptomId - Symptom ID
 * @returns {Promise} Symptom record
 */
export const getSymptom = async (babyId, symptomId) => {
  const response = await api.get(`/babies/${babyId}/symptoms/${symptomId}`);
  return response.data;
};

/**
 * Update symptom record
 * @param {string} babyId - Baby ID
 * @param {string} symptomId - Symptom ID
 * @param {Object} symptomData - Updated symptom data
 * @returns {Promise} Updated symptom record
 */
export const updateSymptom = async (babyId, symptomId, symptomData) => {
  const response = await api.put(`/babies/${babyId}/symptoms/${symptomId}`, symptomData);
  return response.data;
};

/**
 * Delete symptom record
 * @param {string} babyId - Baby ID
 * @param {string} symptomId - Symptom ID
 * @returns {Promise} Response data
 */
export const deleteSymptom = async (babyId, symptomId) => {
  const response = await api.delete(`/babies/${babyId}/symptoms/${symptomId}`);
  return response.data;
};

/**
 * Get symptom statistics
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (startDate, endDate)
 * @returns {Promise} Symptom statistics
 */
export const getSymptomStats = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/symptoms/stats`, { params });
  return response.data;
};

/**
 * Get common symptom types
 * @returns {Promise} Array of common symptom types
 */
export const getSymptomTypes = async () => {
  const response = await api.get('/symptoms/types');
  return response.data;
};

export default {
  createSymptom,
  getSymptoms,
  getSymptom,
  updateSymptom,
  deleteSymptom,
  getSymptomStats,
  getSymptomTypes
};
