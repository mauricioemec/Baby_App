const env = require('../config/env');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, color, ...args) => {
  const timestamp = getTimestamp();
  const prefix = `${color}[${timestamp}] [${level}]${colors.reset}`;
  return [prefix, ...args];
};

const logger = {
  info: (...args) => {
    console.log(...formatMessage('INFO', colors.blue, ...args));
  },

  success: (...args) => {
    console.log(...formatMessage('SUCCESS', colors.green, ...args));
  },

  warn: (...args) => {
    console.warn(...formatMessage('WARN', colors.yellow, ...args));
  },

  error: (...args) => {
    console.error(...formatMessage('ERROR', colors.red, ...args));
  },

  debug: (...args) => {
    if (env.NODE_ENV === 'development') {
      console.log(...formatMessage('DEBUG', colors.gray, ...args));
    }
  },

  http: (method, url, statusCode, duration) => {
    const color = statusCode >= 500 ? colors.red :
                  statusCode >= 400 ? colors.yellow :
                  statusCode >= 300 ? colors.cyan :
                  statusCode >= 200 ? colors.green :
                  colors.reset;

    console.log(
      ...formatMessage('HTTP', color, `${method} ${url} ${statusCode} - ${duration}ms`)
    );
  },
};

module.exports = logger;
