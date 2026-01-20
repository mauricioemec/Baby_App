/**
 * Validações de formulário para BabyTrack Pro
 */

/**
 * Valida email
 * @param {string} email - Email a validar
 * @returns {boolean} Verdadeiro se válido
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida telefone brasileiro
 * @param {string} phone - Telefone a validar
 * @returns {boolean} Verdadeiro se válido
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;

  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');

  // Aceita 10 ou 11 dígitos (com ou sem nono dígito)
  return cleaned.length === 10 || cleaned.length === 11;
};

/**
 * Valida CPF
 * @param {string} cpf - CPF a validar
 * @returns {boolean} Verdadeiro se válido
 */
export const isValidCPF = (cpf) => {
  if (!cpf) return false;

  const cleaned = cpf.replace(/\D/g, '');

  if (cleaned.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
};

/**
 * Valida senha (mínimo 8 caracteres, pelo menos uma letra e um número)
 * @param {string} password - Senha a validar
 * @returns {Object} Objeto com isValid e mensagem de erro
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  if (!/[A-Za-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida peso (em gramas)
 * @param {number} weight - Peso a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateWeight = (weight) => {
  if (weight == null || weight === '') {
    return { isValid: false, error: 'Weight is required' };
  }

  const numWeight = Number(weight);

  if (isNaN(numWeight)) {
    return { isValid: false, error: 'Weight must be a number' };
  }

  if (numWeight < 500) {
    return { isValid: false, error: 'Weight too low (minimum 500g)' };
  }

  if (numWeight > 10000) {
    return { isValid: false, error: 'Weight too high (maximum 10kg)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida altura (em centímetros)
 * @param {number} height - Altura a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateHeight = (height) => {
  if (height == null || height === '') {
    return { isValid: false, error: 'Height is required' };
  }

  const numHeight = Number(height);

  if (isNaN(numHeight)) {
    return { isValid: false, error: 'Height must be a number' };
  }

  if (numHeight < 30) {
    return { isValid: false, error: 'Height too low (minimum 30cm)' };
  }

  if (numHeight > 100) {
    return { isValid: false, error: 'Height too high (maximum 100cm)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida perímetro cefálico (em centímetros)
 * @param {number} headCircumference - PC a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateHeadCircumference = (headCircumference) => {
  if (headCircumference == null || headCircumference === '') {
    return { isValid: false, error: 'Head circumference is required' };
  }

  const numHC = Number(headCircumference);

  if (isNaN(numHC)) {
    return { isValid: false, error: 'Head circumference must be a number' };
  }

  if (numHC < 25) {
    return { isValid: false, error: 'Head circumference too low (minimum 25cm)' };
  }

  if (numHC > 60) {
    return { isValid: false, error: 'Head circumference too high (maximum 60cm)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida volume de leite (em ml)
 * @param {number} volume - Volume a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateMilkVolume = (volume) => {
  if (volume == null || volume === '') {
    return { isValid: false, error: 'Volume is required' };
  }

  const numVolume = Number(volume);

  if (isNaN(numVolume)) {
    return { isValid: false, error: 'Volume must be a number' };
  }

  if (numVolume < 0) {
    return { isValid: false, error: 'Volume cannot be negative' };
  }

  if (numVolume > 300) {
    return { isValid: false, error: 'Volume too high (maximum 300ml)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida duração de mamada (em minutos)
 * @param {number} duration - Duração a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateFeedingDuration = (duration) => {
  if (duration == null || duration === '') {
    return { isValid: false, error: 'Duration is required' };
  }

  const numDuration = Number(duration);

  if (isNaN(numDuration)) {
    return { isValid: false, error: 'Duration must be a number' };
  }

  if (numDuration < 0) {
    return { isValid: false, error: 'Duration cannot be negative' };
  }

  if (numDuration > 120) {
    return { isValid: false, error: 'Duration too long (maximum 120 minutes)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida volume de xixi (em ml)
 * @param {number} volume - Volume a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateUrineVolume = (volume) => {
  if (volume == null || volume === '') {
    return { isValid: false, error: 'Volume is required' };
  }

  const numVolume = Number(volume);

  if (isNaN(numVolume)) {
    return { isValid: false, error: 'Volume must be a number' };
  }

  if (numVolume < 0) {
    return { isValid: false, error: 'Volume cannot be negative' };
  }

  if (numVolume > 500) {
    return { isValid: false, error: 'Volume too high (maximum 500ml)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida data de nascimento
 * @param {Date|string} birthDate - Data de nascimento
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateBirthDate = (birthDate) => {
  if (!birthDate) {
    return { isValid: false, error: 'Birth date is required' };
  }

  const date = new Date(birthDate);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  const now = new Date();

  if (date > now) {
    return { isValid: false, error: 'Birth date cannot be in the future' };
  }

  // Máximo 2 anos atrás
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  if (date < twoYearsAgo) {
    return { isValid: false, error: 'Birth date cannot be more than 2 years ago' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida nome (mínimo 2 caracteres)
 * @param {string} name - Nome a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, error: 'Name is too long (maximum 100 characters)' };
  }

  return { isValid: true, error: null };
};

/**
 * Valida campo obrigatório
 * @param {any} value - Valor a validar
 * @param {string} fieldName - Nome do campo
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value == null || value === '' || (typeof value === 'string' && value.trim() === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: null };
};

/**
 * Valida OTP (código de 6 dígitos)
 * @param {string} otp - OTP a validar
 * @returns {Object} Objeto com isValid e mensagem
 */
export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, error: 'OTP is required' };
  }

  const cleaned = otp.replace(/\D/g, '');

  if (cleaned.length !== 6) {
    return { isValid: false, error: 'OTP must be 6 digits' };
  }

  return { isValid: true, error: null };
};

export default {
  isValidEmail,
  isValidPhone,
  isValidCPF,
  validatePassword,
  validateWeight,
  validateHeight,
  validateHeadCircumference,
  validateMilkVolume,
  validateFeedingDuration,
  validateUrineVolume,
  validateBirthDate,
  validateName,
  validateRequired,
  validateOTP
};
