const express = require('express');
const { z } = require('zod');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validator');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { VALIDATION } = require('../utils/constants');

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `Senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().length(VALIDATION.OTP_LENGTH, `Código deve ter ${VALIDATION.OTP_LENGTH} dígitos`),
});

const resendOtpSchema = z.object({
  email: z.string().email('Email inválido'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(VALIDATION.PASSWORD_MIN_LENGTH, `Nova senha deve ter no mínimo ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres`),
});

// Public routes (with rate limiting)
router.post('/signup', authRateLimiter, validateBody(signupSchema), authController.signup);
router.post('/login', authRateLimiter, validateBody(loginSchema), authController.login);
router.post('/verify-otp', authRateLimiter, validateBody(verifyOtpSchema), authController.verifyOtp);
router.post('/resend-otp', authRateLimiter, validateBody(resendOtpSchema), authController.resendOtp);

// Protected routes
router.post('/logout', authMiddleware, authController.logout);
router.get('/me', authMiddleware, authController.me);
router.post('/change-password', authMiddleware, validateBody(changePasswordSchema), authController.changePassword);

module.exports = router;
