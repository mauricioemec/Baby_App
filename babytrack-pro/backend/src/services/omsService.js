const omsData = require('../data/oms-data.json');
const logger = require('../utils/logger');

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
const getOMSValue = (ageMonths, sex, metric, percentile) => {
  const data = omsData[metric]?.[sex];
  if (!data) {
    logger.warn(`OMS data not found for metric: ${metric}, sex: ${sex}`);
    return null;
  }

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
const calculatePercentile = (value, ageMonths, sex, metric) => {
  const percentiles = ['P3', 'P15', 'P50', 'P85', 'P97'];
  const values = percentiles.map(p => getOMSValue(ageMonths, sex, metric, p));

  if (values.some(v => v === null)) {
    logger.warn(`Could not calculate percentile for ${metric}`);
    return null;
  }

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

  // Between percentiles - return the closer one
  for (let i = 0; i < values.length - 1; i++) {
    if (value >= values[i] && value <= values[i + 1]) {
      const distToLower = Math.abs(value - values[i]);
      const distToUpper = Math.abs(value - values[i + 1]);
      return distToLower <= distToUpper ? percentiles[i] : percentiles[i + 1];
    }
  }

  return 'P50'; // Default fallback
};

/**
 * Get all OMS data (useful for charts)
 * @param {string} sex - "male" or "female"
 * @param {string} metric - "weight", "height", "headCircumference"
 * @returns {Object} - OMS data for the specified sex and metric
 */
const getOMSData = (sex, metric) => {
  return omsData[metric]?.[sex] || {};
};

module.exports = {
  getOMSValue,
  calculatePercentile,
  getOMSData,
};
