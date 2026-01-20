const env = require('../config/env');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * In-memory rate limiter
 * Key: IP address or user ID
 * Value: { count, resetTime }
 */
const rateLimitStore = new Map();

/**
 * Clean up expired entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

/**
 * Rate limiter middleware
 * @param {Object} options - Rate limit options
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {number} options.max - Maximum number of requests per window
 * @param {string} options.keyGenerator - Function to generate rate limit key
 * @returns {Function} - Express middleware
 */
const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || env.RATE_LIMIT_WINDOW_MS;
  const max = options.max || env.RATE_LIMIT_MAX_REQUESTS;
  const keyGenerator = options.keyGenerator || ((req) => req.ip);

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // Create new record
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, record);
      return next();
    }

    // Increment count
    record.count++;

    // Check if limit exceeded
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);

      res.set('Retry-After', retryAfter);
      return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: 'Muitas requisições. Tente novamente mais tarde.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter,
      });
    }

    next();
  };
};

/**
 * Rate limiter for authentication routes (stricter)
 */
const authRateLimiter = rateLimiter({
  windowMs: 3600000, // 1 hour
  max: 100, // 100 requests per hour
  keyGenerator: (req) => req.ip,
});

/**
 * Rate limiter for API routes (more lenient)
 */
const apiRateLimiter = rateLimiter({
  windowMs: 900000, // 15 minutes
  max: 1000, // 1000 requests per 15 minutes
  keyGenerator: (req) => req.user?.id || req.ip,
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  apiRateLimiter,
};
