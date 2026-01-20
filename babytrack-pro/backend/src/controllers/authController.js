const { prisma } = require('../config/database');
const bcryptUtil = require('../utils/bcrypt');
const jwtUtil = require('../utils/jwt');
const otpService = require('../services/otpService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../utils/constants');
const { AppError } = require('../middleware/errorHandler');

/**
 * POST /api/auth/signup
 * Create new user account and send OTP
 */
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email já cadastrado', HTTP_STATUS.CONFLICT, 'EMAIL_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcryptUtil.hash(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate and send OTP
    const otpCode = await otpService.createOTP(user.id);
    await emailService.sendOTPEmail(email, otpCode);

    logger.info(`User signed up: ${email}`);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Conta criada com sucesso. Verifique seu email para o código OTP.',
      data: {
        userId: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Email ou senha incorretos', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isPasswordValid = await bcryptUtil.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Email ou senha incorretos', HTTP_STATUS.UNAUTHORIZED, 'INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = jwtUtil.sign({ userId: user.id });

    logger.info(`User logged in: ${email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }

    // Verify OTP
    await otpService.verifyOTP(user.id, code);

    // Generate JWT token
    const token = jwtUtil.sign({ userId: user.id });

    logger.info(`OTP verified for user: ${email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'OTP verificado com sucesso',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-otp
 * Resend OTP code
 */
const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', HTTP_STATUS.NOT_FOUND, 'USER_NOT_FOUND');
    }

    // Generate and send new OTP
    const otpCode = await otpService.createOTP(user.id);
    await emailService.sendOTPEmail(email, otpCode);

    logger.info(`OTP resent to: ${email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Novo código OTP enviado para seu email',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout user (client-side only, token invalidation happens on client)
 */
const logout = async (req, res, next) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current user information
 */
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/change-password
 * Change user password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // Verify current password
    const isPasswordValid = await bcryptUtil.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new AppError('Senha atual incorreta', HTTP_STATUS.UNAUTHORIZED, 'INVALID_PASSWORD');
    }

    // Hash new password
    const hashedPassword = await bcryptUtil.hash(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    // Send notification email
    await emailService.sendPasswordChangeEmail(user.email);

    logger.info(`Password changed for user: ${user.email}`);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Senha alterada com sucesso',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  resendOtp,
  logout,
  me,
  changePassword,
};
