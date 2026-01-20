const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');

let transporter = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
  if (!env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    logger.warn('⚠ Email credentials not configured. Email features will be disabled.');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
  });

  logger.info('✓ Email service initialized successfully');
  return transporter;
};

/**
 * Send OTP verification email
 * @param {string} email - Recipient email
 * @param {string} code - OTP code
 * @returns {Promise<void>}
 */
const sendOTPEmail = async (email, code) => {
  if (!transporter) {
    logger.warn('Email service not configured. OTP:', code);
    return;
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: 'BabyTrack Pro - Código de Verificação',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .otp-code {
            background: white;
            border: 2px solid #60A5FA;
            border-radius: 8px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            margin: 20px 0;
            color: #3B82F6;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BabyTrack Pro</h1>
          </div>
          <div class="content">
            <h2>Código de Verificação</h2>
            <p>Olá! Você solicitou um código de verificação para acessar sua conta no BabyTrack Pro.</p>
            <p>Use o código abaixo para completar seu cadastro:</p>
            <div class="otp-code">${code}</div>
            <p><strong>Este código expira em ${env.OTP_EXPIRY_MINUTES} minutos.</strong></p>
            <p>Se você não solicitou este código, por favor ignore este email.</p>
          </div>
          <div class="footer">
            <p>Este é um email automático. Por favor, não responda.</p>
            <p>&copy; ${new Date().getFullYear()} BabyTrack Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`OTP email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending OTP email:', error);
    throw new Error('Falha ao enviar email de verificação');
  }
};

/**
 * Send password change notification email
 * @param {string} email - Recipient email
 * @returns {Promise<void>}
 */
const sendPasswordChangeEmail = async (email) => {
  if (!transporter) {
    logger.warn('Email service not configured. Password change notification not sent.');
    return;
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: 'BabyTrack Pro - Senha Alterada',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .alert {
            background: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BabyTrack Pro</h1>
          </div>
          <div class="content">
            <h2>Senha Alterada</h2>
            <p>Olá! Este email confirma que sua senha foi alterada com sucesso.</p>
            <div class="alert">
              <strong>⚠ Importante:</strong> Se você não realizou esta alteração, entre em contato conosco imediatamente.
            </div>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Password change email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending password change email:', error);
  }
};

module.exports = {
  initializeTransporter,
  sendOTPEmail,
  sendPasswordChangeEmail,
};
