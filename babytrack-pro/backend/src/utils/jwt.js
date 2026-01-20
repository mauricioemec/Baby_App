const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Sign a JWT token
 * @param {Object} payload - Data to encode in the token
 * @param {string} expiresIn - Token expiration (default from env)
 * @returns {string} - JWT token
 */
const sign = (payload, expiresIn = env.JWT_EXPIRES_IN) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded payload
 * @throws {Error} - If token is invalid or expired
 */
const verify = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

/**
 * Decode a JWT token without verification (useful for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} - Decoded payload or null
 */
const decode = (token) => {
  return jwt.decode(token);
};

module.exports = {
  sign,
  verify,
  decode,
};
