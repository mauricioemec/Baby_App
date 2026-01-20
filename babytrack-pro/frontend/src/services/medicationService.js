import api from './api';

/**
 * Medication Service - Handles medications and medication logs
 */

// ========== MEDICATIONS ==========

/**
 * Create medication
 * @param {string} babyId - Baby ID
 * @param {Object} medicationData - Medication data
 * @returns {Promise} Created medication
 */
export const createMedication = async (babyId, medicationData) => {
  const response = await api.post(`/babies/${babyId}/medications`, medicationData);
  return response.data;
};

/**
 * Get all medications for baby
 * @param {string} babyId - Baby ID
 * @param {Object} params - Query parameters (active)
 * @returns {Promise} Array of medications
 */
export const getMedications = async (babyId, params = {}) => {
  const response = await api.get(`/babies/${babyId}/medications`, { params });
  return response.data;
};

/**
 * Get medication by ID
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @returns {Promise} Medication data
 */
export const getMedication = async (babyId, medicationId) => {
  const response = await api.get(`/babies/${babyId}/medications/${medicationId}`);
  return response.data;
};

/**
 * Update medication
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {Object} medicationData - Updated medication data
 * @returns {Promise} Updated medication
 */
export const updateMedication = async (babyId, medicationId, medicationData) => {
  const response = await api.put(`/babies/${babyId}/medications/${medicationId}`, medicationData);
  return response.data;
};

/**
 * Delete medication
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @returns {Promise} Response data
 */
export const deleteMedication = async (babyId, medicationId) => {
  const response = await api.delete(`/babies/${babyId}/medications/${medicationId}`);
  return response.data;
};

/**
 * Activate/deactivate medication
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {boolean} isActive - Active status
 * @returns {Promise} Updated medication
 */
export const toggleMedicationStatus = async (babyId, medicationId, isActive) => {
  const response = await api.patch(`/babies/${babyId}/medications/${medicationId}/status`, {
    isActive
  });
  return response.data;
};

// ========== MEDICATION LOGS ==========

/**
 * Create medication log (record administration)
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {Object} logData - Log data (timestamp, dose, notes)
 * @returns {Promise} Created medication log
 */
export const createMedicationLog = async (babyId, medicationId, logData) => {
  const response = await api.post(
    `/babies/${babyId}/medications/${medicationId}/logs`,
    logData
  );
  return response.data;
};

/**
 * Get medication logs
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID (optional)
 * @param {Object} params - Query parameters (startDate, endDate, limit)
 * @returns {Promise} Array of medication logs
 */
export const getMedicationLogs = async (babyId, medicationId = null, params = {}) => {
  const url = medicationId
    ? `/babies/${babyId}/medications/${medicationId}/logs`
    : `/babies/${babyId}/medication-logs`;

  const response = await api.get(url, { params });
  return response.data;
};

/**
 * Get medication log by ID
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {string} logId - Log ID
 * @returns {Promise} Medication log
 */
export const getMedicationLog = async (babyId, medicationId, logId) => {
  const response = await api.get(
    `/babies/${babyId}/medications/${medicationId}/logs/${logId}`
  );
  return response.data;
};

/**
 * Update medication log
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {string} logId - Log ID
 * @param {Object} logData - Updated log data
 * @returns {Promise} Updated medication log
 */
export const updateMedicationLog = async (babyId, medicationId, logId, logData) => {
  const response = await api.put(
    `/babies/${babyId}/medications/${medicationId}/logs/${logId}`,
    logData
  );
  return response.data;
};

/**
 * Delete medication log
 * @param {string} babyId - Baby ID
 * @param {string} medicationId - Medication ID
 * @param {string} logId - Log ID
 * @returns {Promise} Response data
 */
export const deleteMedicationLog = async (babyId, medicationId, logId) => {
  const response = await api.delete(
    `/babies/${babyId}/medications/${medicationId}/logs/${logId}`
  );
  return response.data;
};

/**
 * Get today's medication schedule
 * @param {string} babyId - Baby ID
 * @returns {Promise} Today's medications with administration status
 */
export const getTodaySchedule = async (babyId) => {
  const response = await api.get(`/babies/${babyId}/medications/today`);
  return response.data;
};

export default {
  // Medications
  createMedication,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication,
  toggleMedicationStatus,

  // Medication Logs
  createMedicationLog,
  getMedicationLogs,
  getMedicationLog,
  updateMedicationLog,
  deleteMedicationLog,
  getTodaySchedule
};
