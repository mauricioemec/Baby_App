const { prisma } = require('../config/database');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Generate a random OTP code
 * @param {number} length - Length of OTP (default from env)
 * @returns {string} - OTP code
 */
const generateOTP = (length = env.OTP_LENGTH) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Create and store OTP for a user
 * @param {string} userId - User ID
 * @returns {Promise<string>} - Generated OTP code
 */
const createOTP = async (userId) => {
  const code = generateOTP();
  const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate all previous OTPs for this user
  await prisma.otpCode.updateMany({
    where: {
      userId,
      used: false,
    },
    data: {
      used: true,
    },
  });

  // Create new OTP
  await prisma.otpCode.create({
    data: {
      userId,
      code,
      expiresAt,
      used: false,
    },
  });

  logger.debug(`OTP created for user ${userId}: ${code}`);
  return code;
};

/**
 * Verify OTP code
 * @param {string} userId - User ID
 * @param {string} code - OTP code to verify
 * @returns {Promise<boolean>} - True if valid
 * @throws {Error} - If OTP is invalid, expired, or already used
 */
const verifyOTP = async (userId, code) => {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      used: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!otpRecord) {
    throw new Error('Código OTP inválido');
  }

  if (new Date() > otpRecord.expiresAt) {
    throw new Error('Código OTP expirado');
  }

  // Mark OTP as used
  await prisma.otpCode.update({
    where: {
      id: otpRecord.id,
    },
    data: {
      used: true,
    },
  });

  logger.info(`OTP verified for user ${userId}`);
  return true;
};

/**
 * Check if user has a valid unused OTP
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - True if valid OTP exists
 */
const hasValidOTP = async (userId) => {
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  return !!otpRecord;
};

/**
 * Clean up expired OTPs (called periodically)
 * @returns {Promise<number>} - Number of deleted OTPs
 */
const cleanupExpiredOTPs = async () => {
  const result = await prisma.otpCode.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  if (result.count > 0) {
    logger.debug(`Cleaned up ${result.count} expired OTPs`);
  }

  return result.count;
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
  hasValidOTP,
  cleanupExpiredOTPs,
};
