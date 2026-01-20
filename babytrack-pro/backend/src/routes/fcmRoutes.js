const express = require('express');
const { z } = require('zod');
const fcmController = require('../controllers/fcmController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBody } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation schemas
const tokenSchema = z.object({
  token: z.string().min(1, 'Token FCM é obrigatório'),
});

// Routes
router.post('/register', validateBody(tokenSchema), fcmController.registerToken);
router.post('/unregister', validateBody(tokenSchema), fcmController.unregisterToken);

module.exports = router;
